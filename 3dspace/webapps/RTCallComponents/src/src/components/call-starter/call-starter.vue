<script setup>
import { ref, computed, onMounted } from 'vue'
import ContactList from './contact-list.vue'
import { useRTCStore } from '../../stores/RTCStore';
import { useTranslations } from '../utils/translations';
const { i18n, $i18n, promise } = useTranslations('callhistory')

const props = defineProps(['searchedValue'])

const rtcStore = useRTCStore();

const contactListRef = ref();
const translationsLoaded = ref(false);

const contact = computed(() => props.searchedValue);
const emit = defineEmits(['startConversation']);

onMounted((async () => {
  await promise;
  promise.then(translationsLoaded.value = true)
}))

function sendMsg(user) {
  emit('startConversation', user);
}

const contactSearch = computed(() => {
  let favs = rtcStore.favorites;
  let favorites = [];
  for (let i = 0; i < favs.length; i++) {
    if (favs[i].convId) {
      let contact = Object.assign({}, rtcStore.getConversationById(String(favs[i].convId)));
      contact.favoriteType = favs[i].type;
      favorites.push(contact);
    }
    else if (favs[i].userId) {
      let contact = Object.assign({}, rtcStore.getUserById(String(favs[i].userId)));
      contact.favoriteType = favs[i].type;
      favorites.push(contact);
    }
    else if (favs[i].extConvId) {
      let contact = Object.assign({}, rtcStore.getConversationById(String(favs[i].extConvId)));
      contact.favoriteType = favs[i].type;
      favorites.push(contact);
    }

  }
  if (contact.value) {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let filteredFavs = favorites.filter((favorite) => {
      if (favorite.members) {
        let members = favorite.members.filter((user) => { return user.login !== rtcStore.currentUserLogin });
        let membersLogin = members.map(member => normalizeString(member.login.toLowerCase()));
        let memberUserNames = members.map(member => normalizeString(member.username.toLowerCase()));

        let filteredLogins = membersLogin.filter(login => login.includes(normalizeString(contact.value.toLowerCase())))
        let filteredUsernames = memberUserNames.filter(username => username.includes(normalizeString(contact.value.toLowerCase())))
        if ((filteredLogins || filteredUsernames) && (filteredLogins.length || filteredUsernames.length))
          return true;
      }

      if (normalizeString(favorite.title.toLowerCase()).includes(normalizeString(contact.value.toLowerCase())))
        return true;
      return false;

    });
    return filteredFavs
  }
  else return favorites
})

</script>

<template>
  <div v-if="translationsLoaded">
    <h5 class="favorite-text">{{ $i18n('favorites') }}</h5>
    <contact-list ref="contactListRef" :contact-list="contactSearch" @start-conversation="sendMsg" />
  </div>
</template>

<style scoped>
.favorite-text {
  padding-left: 4px;
}
</style>
