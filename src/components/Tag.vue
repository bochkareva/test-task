<template>
  <div class="tag">
    <span class="tag__name">{{ text }}</span>
    <button
        class="tag__button"
        @click="$emit('deleteTag')">
      <CloseIcon/>
    </button>
  </div>
</template>

<script>
import CloseIcon from './icons/CloseIcon'

export default {
  name: 'Tag',

  components: {
    CloseIcon,
  },

  props: {
    text: {
      type: String,
      required: true,
    },
  }
};
</script>

<style>
.tag {
  background: var(--primary);
  display: inline-flex;
  padding: 4px 0 4px 8px;
  color: white;
  border-radius: 2px;
  height: 24px;
}

.tag__button {
  background: none;
  border: none;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.tag__button svg {
  fill: white;
}

.tag__button:hover svg{
  fill-opacity: 0.6;
}
</style>