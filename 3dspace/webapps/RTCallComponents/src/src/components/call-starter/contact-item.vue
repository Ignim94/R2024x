<script setup>
import { computed, onBeforeMount, shallowRef, defineAsyncComponent } from 'vue';
import { useRTCStore } from '../../stores/RTCStore';
import { requirejs } from '../../modules/require';

const props = defineProps(['contact'])

const rtcStore = useRTCStore()
const VueUserPresence = shallowRef();

const usersInContact = computed(() => {
  if (props.contact?.isConversation){
    if(props.contact.members.length === 1)
      return props.contact.members
  
    const users = props.contact.members.filter(el => el.login !== rtcStore.currentUserLogin)
    return users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)
  } else {
    if( props.contact?.isUser ) {
      return [props.contact];
    }
    else {
      if( props.contact?.members && props.contact.members.length >= 1 ) {
        const users = props.contact.members.filter(el => el.login !== rtcStore.currentUserLogin)
        return users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)
      }
    }
  }
})
const getAvatarUrl = (login) => { return rtcStore.swymUrl + '/api/user/getpicture/login/' + login }

onBeforeMount(() => {
  VueUserPresence.value = defineAsyncComponent(async() => {
    const [VueUserPresenceAPI] = await requirejs(['DS/VueUserPresenceAPI/VueUserPresenceAPI']);
    return VueUserPresenceAPI;
  });
});

</script>

<template>
  <div v-if="usersInContact">
    <div v-if="usersInContact.length > 1" class="conv">
      <div class="flex justify-center items-center">
        <VueUserPresence 
          class='tiny'
          :presence = "usersInContact[0].presence.show.toLowerCase()"
          :src = "getAvatarUrl(usersInContact[0].login)" 
          />
      </div>
      <div v-if="usersInContact.length === 2" />
      <div v-if="usersInContact.length === 2" />
      <div class="flex justify-center items-center">
        <VueUserPresence
          class='tiny'
          :presence = "usersInContact[1].presence.show.toLowerCase()"
          :src = "getAvatarUrl(usersInContact[1].login)" />
      </div>
      <div
        v-if="usersInContact[2]"
        class="flex justify-center items-center"
      >
        <VueUserPresence
          class='tiny'
          :presence = "usersInContact[2].presence.show.toLowerCase()"
          :src = "getAvatarUrl(usersInContact[2].login)" />
      </div>
      <div
        v-if="usersInContact[3]"
        class="flex justify-center items-center"
      >
        <VueUserPresence
          class='tiny'
          :presence = "usersInContact[3].presence.show.toLowerCase()"
          :src = "getAvatarUrl(usersInContact[3].login)" />
      </div>
      <div
        v-if="contact.members.length > 5"
        class="flex justify-center items-center"
      >
        <span>
          +{{ contact.members.length - 4 }}
        </span>
      </div>
    </div>
    <div v-else class="">
        <VueUserPresence
          class='medium rounded-full' 
          :presence = "usersInContact[0].presence.show?.toLowerCase() || usersInContact[0].presence.toLowerCase()"
          :src = "getAvatarUrl(usersInContact[0].login)" />
    </div>
  </div>
</template>

<style scoped>

.conv {
   display: inline-grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
   grid-template-rows: repeat(2, minmax(0, 1fr));
}
</style>
