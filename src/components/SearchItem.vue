<template>
  <button class="search-item" @click="$emit('selectItem')">
    <img v-if="imageUrl"
         class="search-item__image"
         :src="imageUrl"
         aria-labelledby="item-name"
         alt="Аватар пользователя или компании">
    <img v-else-if="type === 'user'"
         class="search-item__image"
         src='../assets/images/empty-user.svg'
         alt="Пустой аватар пользователя">
    <img v-else
         class="search-item__image"
         src='../assets/images/empty-company.svg'
         alt="Пустой аватар компании">

    <div class="search-item__info">
      <div id="item-name" class="search-item__name">{{ name ? name : alias }}</div>
      <div class="search-item__caption">{{ type === 'user' ? `@${alias}` : 'компания' }}</div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'SearchItem',

  props: {
    imageUrl: {
      type: String,
    },

    name: {
      type: String,
    },

    alias: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: 'user',
      validator: value => ['user', 'company'].includes(value),
    }
  }
};
</script>

<style>
.search-item {
  padding: 16px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
}

.search-item:hover, .search-item:focus{
  background: #eeeeee;
  outline: none;
}

.search-item__image {
  height: 36px;
  width: 36px;
  border-radius: 4px;
  display: flex;
  margin-right: 8px;
}

.search-item__info {
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
}

.search-item__name {
  color: black;

}
.search-item__caption {
  color: var(--secondary);
}
</style>