<template>
  <div class="custom-suggest"
       :id="`custom-suggest-${componentId}`">
    <label class="suggest-label" :for="`suggest-input-${componentId}`">{{ label }}</label>
    <div class="suggest-wrapper">
      <input
          autocomplete="off"
          name="search"
          type="text"
          :id="`suggest-input-${componentId}`"
          class="suggest-input"
          @focus="openDropdown()"
          :disabled="selectedTags.length > 0"
          :placeholder="placeholder"
          v-model.trim="searchString">

      <div v-if="selectedTags.length"
           class="tag-list"
           :id="`tag-list-${componentId}`">
        <Tag
            v-for="(tag,index) in selectedTags"
            :key="index"
            :text="tag"
            @deleteTag="deleteTag(tag)"/>
      </div>
    </div>

    <div v-if="isOpenedDropdown"
         :id="`dropdown-${componentId}`"
         class="dropdown">
      <div v-if="isLoading" class="dropdown__loading"><Loader/></div>
      <div v-else-if="errorCode !== 0" class="dropdown__error">Ошибка при обработке запроса, попробуйте еще раз</div>
      <div v-else-if="!searchData.length" class="dropdown__empty">Ничего не найдено</div>
      <template v-else>
      <SearchItem
          v-for="(item, index) in searchData"
          :key="`${item.alias}${index}`"
          :image-url="item.avatar"
          :name="item.name"
          :alias="item.alias"
          :type="item.type"
          @selectItem="selectItem(item)"/>
      </template>
    </div>
  </div>
</template>

<script>
import Tag from './Tag'
import SearchItem from './SearchItem'
import Loader from './Loader';
import { debounce } from '../helpers';

export default {
  name: "CustomSuggest",

  components:{
    Loader,
    Tag,
    SearchItem,
  },

  props: {
    label: {
      type: String,
      default: 'Пользователь или компания'
    },

    placeholder: {
      type: String,
      default: 'Введите логин'
    },

    apiUrl: {
      type: String,
      default: 'https://habr.com/kek/v2/publication/suggest-mention'
    },

    isMultipleChoice: {
      type: Boolean,
      default: false,
    }
  },

  data: () => ({
    componentId: null,
    searchString: '',
    searchData: [],
    selectedTags: [],
    errorCode: 0,
    isLoading: false,
    isOpenedDropdown: false,
    debounceSearch: null,
  }),

  watch: {
    searchString() {
      if (this.searchString.length < 3) {
        this.searchData = [];
        this.isOpenedDropdown = false;
        return;
      }
      this.isLoading = true;
      this.isOpenedDropdown = true;
      this.debounceSearch() ;
    }
  },

  created() {
    this.componentId = Math.floor(Math.random() * 1000);
    this.debounceSearch = debounce(this.search, 1000);
  },

  mounted() {
    const suggestElement = document.getElementById(`custom-suggest-${this.componentId}`);
    suggestElement && suggestElement.addEventListener('keydown', this.keyboardWatcher);
    document.addEventListener('click', this.clickOutside);
  },

  methods: {
    async search() {
      if (this.searchString.length < 3) {
        return;
      }

      this.errorCode = 0;
      let response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(this.searchString)}`, {
        method: 'GET',
      });

      if (response.ok) {
        let result = await response.json();
        this.searchData = result.data;
      } else {
        this.errorCode = response.status;
      }

      this.isLoading = false;
    },

    selectItem(item) {
      const itemAlias = `@${item.alias}`;
      if (this.selectedTags.find(item => item === itemAlias)) {
        return;
      }

      this.selectedTags.push(itemAlias);
      this.$emit('changeSelectedTags', this.selectedTags);

      if (!this.isMultipleChoice) {
        this.isOpenedDropdown = false;
      }

      this.resizeInput();
    },

    async deleteTag(deletedTag) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== deletedTag);
      this.$emit('changeSelectedTags', this.selectedTags);

      await this.resizeInput();

      // если тег был последним переводим фокус на поле ввода
      if (!this.selectedTags.length) {
        const inputElement = document.getElementById(`suggest-input-${this.componentId}`);
        if (!inputElement) {
          return;
        }
        await this.$nextTick();
        inputElement.focus();
      }
    },

    openDropdown() {
      this.isOpenedDropdown = this.searchData.length;
    },

    clickOutside(event){
      const dropdownElement = document.getElementById(`dropdown-${this.componentId}`);
      const inputElement = document.getElementById(`suggest-input-${this.componentId}`);

      if (!dropdownElement || !inputElement) {
        return;
      }

      if (!dropdownElement.contains(event.target) && !inputElement.contains(event.target)){
        this.isOpenedDropdown = false;
      }
    },

    keyboardWatcher(event) {
      switch (event.key) {
        case 'Escape': {
          this.isOpenedDropdown = false;
          break;
        }
      }
    },

    async resizeInput() {
      if (!this.isMultipleChoice) {
        return;
      }

      await this.$nextTick();
      const inputElement = document.getElementById(`suggest-input-${this.componentId}`);
      const tagListElement = document.getElementById(`tag-list-${this.componentId}`);

      if (!inputElement || !tagListElement) {
        return;
      }

      inputElement.style.height = `${tagListElement.offsetHeight - 14}px`;
    }
  },

  beforeDestroy() {
    const suggestElement = document.getElementById(`custom-suggest-${this.componentId}`);
    suggestElement && suggestElement.removeEventListener('keydown', this.keyboardWatcher);
    document.removeEventListener('click', this.clickOutside);
  },
};
</script>

<style>
.custom-suggest {
  width: 100%;
  position: relative;
}

.suggest-label {
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: #333;
}

.suggest-label:before {
  content: '*';
  color: red;
  margin-right: 4px;
}

.suggest-input {
  padding: 8px 12px;
  border: 1px solid #d5dddf;
  border-radius: 4px;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  width: calc(100% - 16px);
}

.suggest-input:focus {
  background: white;
  border-color: #a2bfd2;
  outline: none;
}

.suggest-input:disabled {
  background: white;
  color: white;
}

.suggest-wrapper {
  position: relative;
  z-index: 2;
  width: calc(100% - 8px);
  margin-top: 8px;
}

.tag-list {
  position: absolute;
  top: 4px;
  left: 4px;
}

.tag-list .tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.dropdown {
  width: 100%;
  max-height: 272px;
  border-radius: 2px;
  background: white;
  position: absolute;
  overflow: auto;
  z-index: 10;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2);
  transform: translate(0, 6px);
}

.dropdown::-webkit-scrollbar {
  width: 0;
}

.dropdown__empty {
  padding: 12px;
  font-size: 16px;
  line-height: 22px;
  color: var(--secondary);
}

.dropdown__loading {
  padding: 16px;
  text-align: center;
}

.dropdown__error {
  padding: 12px;
  font-size: 16px;
  line-height: 22px;
  color: red;
}
</style>