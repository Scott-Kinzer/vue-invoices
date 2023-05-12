<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <s>There are 4 total invoices</s>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
        <s>Filter by status</s>
        <img src="@/assets/icon-arrow-down.svg" alt="">
        <ul ref="target" v-show="!!filterMenu" class="filter-menu">
          <li>Draft</li>
          <li>Pending</li>
          <li>Paid</li>
          <li>Clear filter</li>
        </ul>
      </div>
      <div @click="newInvoice" class="button flex">
        <div class="inner-button flex">
          <img src="@/assets/icon-plus.svg" alt="">
        </div> 
        <span>New Invoice</span>
      </div>
      </div>
    </div>
    <div>
      <Invoice v-for="(invoice, index) in invoices" :invoice="invoice" :key="index" />
    </div>
  </div>
</template>


<script lang="ts">
import { useInvoiceModal } from '@/stores/modal';
import { onClickOutside, type MaybeElementRef, type MaybeElement } from '@vueuse/core';
import {db, collection, onSnapshot, query} from '../firebase/firebase.init';
import Invoice from '../components/Invoice.vue';


export default {
  components: {
    Invoice,
  },
  data() {
    const modal = useInvoiceModal();

    return {
      openModal: modal.openModal,
      filterMenu: false,
      invoices: [],
    }
  },
  async mounted() {

    const q = query(collection(db, "invoices"));
    onSnapshot(q, (querySnapshot) => {
      const invoices: any = [];
      querySnapshot.forEach((doc) => {
        invoices.push(doc.data());
      });

      this.invoices = invoices;
    });


    onClickOutside(this.$refs.target as MaybeElementRef<MaybeElement>, () => {
      this.filterMenu = false;
    }
  )},
  methods: {
    newInvoice() {
      this.openModal();
    },

    toggleFilterMenu() {
      console.log('xx');
      this.filterMenu = !this.filterMenu;
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  color: white;

  .header {
    margin-bottom: 65px;

    .left, .right {
      flex: 1;
    }
    .right {
      justify-content: flex-end;
      align-items: center;

      .button, .filter {
        align-items: center;

        span {
          font-size: 12px
        }
      }

      .filter {
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        span, img {
          pointer-events: none;
        }

        img {
          margin-left: 12px;
          widows: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        cursor: pointer;
        padding: 8px 10px;
        border-radius: 40px;
        border: none;
        font-size: 12px;
        margin-right: 8px;
        color: #fff;
        background-color: #7c5dfa;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;

          img {
            widows: 10px;
            height: 10px;
          }
        }
      }
    } 
  }

}
</style>