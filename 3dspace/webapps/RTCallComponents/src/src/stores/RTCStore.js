import { defineStore } from 'pinia'
import * as rtconv from '../api/callhistory_api'
import { CommonRequest } from '@3ds/common-request-proxification'

export const useRTCStore = defineStore('RTCStore', {
  // STATE
  state: () => ({
    tenantId: '',
    swymUrl: '',
    isMobile: false,
    currentUserLogin: '',
    currentUserId: '',
    isConnected: false, // socket connetion status
    users: new Map(), // login -> user
    conversations: new Map(), // convId -> conv
    phone: new Map(),
    favs: [],
    isLoading: true,
    isFavLoading: true,
    fetchedOnce: false,
    searchFilter: '',
    swymToken: '',
    rtConvEnable: false
  }),
  // COMPUTED
  getters: {
    searchedContacts: (state) => {
      let searchFilterLower = state.searchFilter.toLowerCase();
      const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      searchFilterLower = normalizeString(searchFilterLower);

      const sortContacts =  function(contacts)  {
        let sortedContacts = contacts.sort((a, b) => {
  
          const hasUserIdA = a.hasOwnProperty('user_id');
          const hasUserIdB = b.hasOwnProperty('user_id');
  
          if (hasUserIdA && !hasUserIdB) {
            return -1;
          } else if (!hasUserIdA && hasUserIdB) {
            return 1;
          } else {
            const membersLengthA = a.members ? a.members.length : 0;
            const membersLengthB = b.members ? b.members.length : 0;
            if (membersLengthA === 2 && membersLengthB !== 2) {
              return -1;
            } else if (membersLengthA !== 2 && membersLengthB === 2) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        return sortedContacts;
      }

      if (state.searchFilter != '') {
        let conversation = [...state.conversations.values()];
        let users = [...state.users.values()];
        let privateConversation = [];


        conversation = conversation.filter((conv) => {
          let members = conv.members.filter((el) => {
            return el.login !== state.currentUserLogin
          });
          if (members.length === 1 && members[0].login && members[0].login !== state.currentUserLogin)
            privateConversation.push(members[0].login);

          if (members.length && members.map(el => normalizeString(el.login.toLowerCase())).includes(searchFilterLower))
            return true;
          if (members.length && members.map(el => normalizeString(el.username.toLowerCase())).includes(searchFilterLower))
            return true;

          if (conv.title && normalizeString(conv.title.toLowerCase()).includes(searchFilterLower))
            return true;
          if (conv.displayPhone && conv.displayPhone.toLowerCase().includes(searchFilterLower))
            return true;
          return false;
        });

        users = users.filter((user) => {
          if (privateConversation.includes(user.login || '')) return false;
          if (user.login === state.currentUserLogin) return false;
          if (user.username && normalizeString(user.username.toLowerCase()).includes(searchFilterLower))
            return true;
          if (user.login && normalizeString(user.login.toLowerCase()).includes(searchFilterLower))
            return true;
          if (user.mainPhone && normalizeString(user.mainPhone.toLowerCase()).includes(searchFilterLower))
            return true;
          return false;
        });
        let result = conversation.concat(users);
        let favorites = result.filter((contact) => contact.isFavorite);
        let suggested = result.filter((contact) => !contact.isFavorite);
        favorites = sortContacts(favorites);
        suggested = sortContacts(suggested)
        return { "favorites": favorites, "suggested": suggested };
      }
      else {
        let favorites = [...state.favs.values()];
        // Remove duplicate from favorites if same contact and different type
        const uniqueFavorites = new Map();
        for (const fav of favorites) {
          fav.key = fav.convId || fav.extConvId || fav.userId;
          const key = `${fav.key}-${fav.sortIdx}`;
          if (!uniqueFavorites.has(key)) {
            uniqueFavorites.set(key, fav);
          }
        }
        const uniqueFavoriteArray = [...uniqueFavorites.values()];
        favorites = uniqueFavoriteArray.map((fav) => {
          if (fav.convId)
            return state.conversations.get(String(fav.convId));
          else if (fav.extConvId)
            return state.conversations.get(String(fav.extConvId));
          else if (fav.userId)
            return state.users.get(String(fav.userId));
        });
        return { "favorites": favorites };
      }
    },
    favorites: (state) => {
      return state.favs;
    }
  },
  // ACTIONS
  actions: {
    connected: function (data) {
      this.swymToken = sessionStorage.getItem('3DSWYM_csrf');
      this.tenantId = data.data.tenant;
      this.swymUrl = (data.appName === "devenv") ? data.options.ressources.swym[0].url : data.options['3dswym'];
      this.currentUserLogin = data.userId;
      this.currentUserId = data.user_id;
      this.isConnected = true;
      if (!this.fetchedOnce) {
        rtconv.getRTCStatus();
        rtconv.fetchConversations(this.tenantId); // TODO: what if v2 conversation are not fetched yet and vice-versa because both will set rtc store loading to false
        this.getV2Conversations();
        this.fetchedOnce = true;
      }
    },
    getV2Conversations: function () {

      let isSwymV2 = true;
      let getV2ConvUrl = this.swymUrl + '/api/directmessages/lite';
      if (this.isMobile) {
        // For mobile app : need to proxify url
        getV2ConvUrl = CommonRequest.proxifyUrl(getV2ConvUrl, {
          proxy: 'passport', method: 'GET', headers: {
            'X-DS-SWYM-CSRFTOKEN': this.swymToken
          }
        });
      }
      fetch(getV2ConvUrl, {
        method: 'GET',
        credentials: 'include',
        redirect: 'error',
        headers: {
          'X-DS-SWYM-CSRFTOKEN': this.swymToken,
          'x-requested-with': 'XMLHttpRequest',
          'content-type': 'application/json;charset=UTF-8',
        },
        timeout: 25000,
      }).then((response) => {
        return response.json();
      })
        .then((data) => {
          this.addConversations(data.result, isSwymV2);
        })
    },
    getV2ConversationsById: function (conversation_id) {
      if (conversation_id && !this.getConversationById(conversation_id) &&
        conversation_id != '' && !Number.isInteger(conversation_id)) {
        let isSwymV2 = true;
        let getV2ConvUrl = this.swymUrl + '/api/directmessages/' + String(conversation_id);
        if (this.isMobile) {
          // For mobile app : need to proxify url
          getV2ConvUrl = CommonRequest.proxifyUrl(getV2ConvUrl, {
            proxy: 'passport', method: 'GET', headers: {
              'X-DS-SWYM-CSRFTOKEN': this.swymToken
            }
          });
        }
        fetch(getV2ConvUrl, {
          method: 'GET',
          credentials: 'include',
          redirect: 'error',
          headers: {
            'X-DS-SWYM-CSRFTOKEN': this.swymToken,
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/json;charset=UTF-8',
          },
          timeout: 25000,
        }).then((response) => {
          return response.json();
        }).then((data) => {
          this.addConversations([data.result], isSwymV2);
        })
      }
    },
    getUserById: function (id) { return this.users.get(String(id)) },
    addUser: function (user) {
      if (user.user_id) {
        if (!user.id) user.id = parseInt(user.user_id);
        user.isFavorite = false;
        user.isUser = true;
        if (!user.username) user.username = (user.first_name || user.firstName) + " " + (user.last_name || user.lastName);
        user.title = user.username;
        let favUser = this.favs.find(fav => fav.userId == user.user_id);
        if (favUser) {
          user.isFavorite = true;
          user.favoriteType = favUser.type;
        }
        this.users.set(user.user_id, user);
      }
    },
    getConversationById: function (id) { return this.conversations.get(String(id)) },
    addConversations: async function (convs, isSwymV2) {

      const updateConversations = async (conv) => {
        return new Promise((resolve) => {
          conv.isConversation = true;

          if (conv.id) {
            if (isSwymV2) {
              if (!conv.members) conv.members = conv.users;
              conv.isSwymV2 = true;
              conv.members.filter((el) => {
                el.username = el.first_name + " " + el.last_name;
                el.isUser = true;
                el.title = el.username;
                if (!el.presence) el.presence = { "statusMsg": "Online", "show": "Online" };
              });
              if (conv.uri) conv.subjectUri = conv.uri;
            }

            const users = (conv.members.length === 1 ? conv.members :
              conv.members.filter(el => el.login !== this.currentUserLogin)) || [];

            conv.members.forEach((user) => {
              this.addUser(user);
            });

            let convTitle = '';
            if (conv.title) convTitle = conv.title;
            else if (conv.topic) convTitle = conv.topic;
            else {
              convTitle = users.map(el => `${el.username}`).join(', ');
            }

            conv.title = convTitle;
            conv.isFavorite = false;

            let favConv = this.favs.find(fav => (fav.convId == conv.id || fav.extConvId == conv.id));
            if (favConv) {
              conv.isFavorite = true;
              conv.favoriteType = favConv.type;
            }
            this.conversations.set(String(conv.id), conv);
          }

          resolve();
        });
      };
      if (convs && convs.length) {
        for (let i = 0; i < convs.length; i++) {
          await updateConversations(convs[i]);
        }
      }
      this.isLoading = false;
    },

    updateConversation: function (data) {
      if (data.convId) {
        let conv = this.getConversationById(data.convId);
        if (data.members)
          conv.members = [...data.members];
        if (data.title)
          conv.title = data.title;

        this.addConversations([conv]);
      }
    },
    setPhoneDetails: function (convs) {
      for (let i = 0; i < convs.length; i++) {
        const users = convs[i].members.filter(el => el.login !== this.currentUserLogin);
        if (users.length == 1 && users[0].mainPhone && users[0].mainPhone != "null") {
          convs[i].displayPhone = users[0].mainPhone;
        }
      }
    },
    setFavorites: function (favs) {
      this.favs = [];
      for (let i = 0; i < favs.length; i++) {
        if (favs[i].extConvId) {
          if (this.conversations.has(String(favs[i].extConvId))) {
            this.conversations.get(String(favs[i].extConvId)).isFavorite = true;
            this.conversations.get(String(favs[i].extConvId)).favoriteType = favs[i].type;
          }
        }
        else if (favs[i].convId) {
          if (this.conversations.has(String(favs[i].convId))) {
            this.conversations.get(String(favs[i].convId)).isFavorite = true;
            this.conversations.get(String(favs[i].convId)).favoriteType = favs[i].type;
          }
        }
        else if (favs[i].userId) {
          if (this.users.has(String(favs[i].userId)))
            this.users.get(String(favs[i].userId)).isFavorite = true;
          else {
            if (favs[i].user) {
              favs[i].user.isFavorite = true;
              favs[i].user.favoriteType = favs[i].type;
              this.addUser(favs[i].user);
            }
            favs[i].isMainPhone ? this.users.get(String(favs[i].userId)).isMainPhone = true : this.users.get(String(favs[i].userId)).isMainPhone = false;
          }
          this.users.get(String(favs[i].userId)).isFavorite = true;
          this.users.get(String(favs[i].userId)).favoriteType = favs[i].type;
        }
      }
      this.favs = favs;
      this.isFavLoading = false;
    },
    // TODO: Move this functions to CallHistory Store
    fetchCallFavorites: function () {
      rtconv.fetchCallFavorites();
    },
    setCallFavorite: function (data) {
      rtconv.setCallFavorite(data);
    },
    removeFromHistory: function (callId) {
      rtconv.removeFromHistory(callId);
    },
    clearHistory: function (lastCallDate) {
      rtconv.clearHistory(lastCallDate);
    },
    searchContacts: function (pattern) {
      this.searchFilter = pattern;
      rtconv.searchContact(pattern)
    }
  },
});