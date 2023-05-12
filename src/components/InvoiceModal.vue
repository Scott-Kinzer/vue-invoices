<template>
    <div @click="checkClick" class="invoice-wrap flex flex-column">
      <Modal v-if="isShowPopUp" />
      <form ref="invoiceWrap" @submit.prevent="submitForm" class="invoice-content">
            <Loading v-if="!!isLoading" />
            <h1>New invoice</h1>

            <div class="bill-from flex flex-column">
                <h4>Bill from</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Street address</label>
                    <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="billerCity">City</label>
                    <input required type="text" id="billerCity" v-model="billerCity">
                </div>
                <div class="input flex flex-column">
                    <label for="billerZipCode">Zip code</label>
                    <input required type="text" id="billerZipCode" v-model="billerZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="billerCountry">Country</label>
                    <input required type="text" id="billerCountry" v-model="billerCountry">
                </div>
                </div>
            </div>



            <div class="bill-to flex flex-column">
                <h4>Bill to</h4>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="clientName">Client name</label>
                    <input required type="text" id="clientName" v-model="clientName">
                </div>
                <div class="input flex flex-column">
                    <label for="clientEmail">Client email</label>
                    <input required type="text" id="clientEmail" v-model="clientEmail">
                </div>
                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Street address</label>
                    <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
                </div>
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="clientCity">City</label>
                    <input required type="text" id="clientCity" v-model="clientCity">
                </div>
                <div class="input flex flex-column">
                    <label for="clientZipCode">Zip code</label>
                    <input required type="text" id="clientZipCode" v-model="clientZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="clientCountry">Country</label>
                    <input required type="text" id="clientCountry" v-model="clientCountry">
                </div>
                </div>
            </div>


                <div class="invoice-work flex flex-column">
                    <div class="payment flex">
                        <div class="input flex flex-column">
                            <label for="invoiceDate">Invoice date</label>
                            <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
                        </div>
                        <div class="input flex flex-column">
                            <label for="paymentDueDate">Payment due</label>
                            <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate">
                        </div>
                    </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment terms</label>
                    <select required type="text" id="paymentTerms" v-model="paymentTerms">
                        <option value="30">
                            New 30 Days
                        </option>
                        <option value="60">
                            New 60 Days
                        </option>
                    </select>
                </div>
                <div class="input flex flex-column">
                    <label for="productDescription">Description</label>
                    <input required type="text" id="productDescription" v-model="productDescription">
                </div>
                </div>

                <div class="work-items">
                    <h3>Item List</h3>

                    <table class="item-list">
                        <tr class="table-heading flex">
                            <th class="item-name">Item Name</th>
                            <th class="qty">Qty</th>
                            <th class="price">Price</th>
                            <th class="total">Total</th>
                        </tr>
                        <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
                            <td class="item-name">
                                <input type="text" v-model="item.name">
                            </td>
                            <td class="qty">
                                <input type="text" v-model="item.qty">
                            </td>
                            <td class="price">
                                <input type="text" v-model="item.price">
                            </td>
                            <td class="total flex">
                                ${{ item.total = item.qty * item.price }}
                            </td>
                            <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="" srcset="">
                        </tr>
                    </table>
                    <div @click="addNewInvoiceItem" class="flex button add-item-button">
                        <img src="@/assets/icon-plus.svg" alt="">
                        Add new item
                    </div>
                </div>

            <div class="save flex">
                <div class="left">
                    <button type="button" @click="closeInvoice" class="red">
                        Cancel
                    </button>
                </div>
                <div class="right flex">
                    <button type="submit" @click="saveDraft" class="dark-purple">
                        Save draft
                    </button>
                    <button type="submit" @click="publishInvoice" class="purple">
                        Create Invoice
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { useInvoiceModal } from '@/stores/modal';
import { usePopModal } from '@/stores/modal';
import { onClickOutside, type MaybeElementRef, type MaybeElement } from '@vueuse/core';
import {uid} from 'uid';
import {db, doc, setDoc, collection, updateDoc, addDoc} from '../firebase/firebase.init';
import Loading from '../components/Loading.vue';
import Modal from './Modal.vue';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';

export type Invoice = {
  isLoading: boolean,
  isShowPopUp: Ref<boolean>,
  dateOptions: { year: "numeric"; month: "short"; day: "numeric" };
  docId: null | string;
  loading: null | boolean;
  billerStreetAddress: null | string;
  billerCity: null | string;
  billerZipCode: null | string;
  billerCountry: null | string;
  clientName: null | string;
  clientEmail: null | string;
  clientStreetAddress: null | string;
  clientCity: null | string;
  clientZipCode: null | string;
  clientCountry: null | string;
  invoiceDateUnix: null | number;
  invoiceDate: null | string | Date;
  paymentTerms: string;
  paymentDueDateUnix: null | number;
  paymentDueDate: string | Date | null;
  productDescription: null | string;
  invoicePending: null | boolean;
  invoicePaid: null | boolean;
  invoiceDraft: null | boolean;
  invoiceItemList: Array<{
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  invoiceTotal: number;
};

export default {
    components: {
    Loading,Modal
    },
    name: 'invoiceModal',
    mounted() {
      const {openPopModal} = usePopModal();
        onClickOutside(this.$refs.invoiceWrap as MaybeElementRef<MaybeElement>, () => {
          if (!this.isShowPopUp) {
            openPopModal()
          }
    });
    },
    created() {
        this.invoiceDateUnix = Date.now();
        this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('en-us', this.dateOptions);

        this.updateFutureDate();
    },
    data() {
      const popUpModal = usePopModal();
      const storePopUp = storeToRefs(popUpModal);

      console.log(storePopUp.isPopModalOpen);

        return {
            isShowPopUp: storePopUp.isPopModalOpen,
            isLoading: false,
            dateOptions: { year: "numeric", month: "short", day: "numeric" },
            docId: null,
            loading: null,
            billerStreetAddress: null,
            billerCity: null,
            billerZipCode: null,
            billerCountry: null,
            clientName: null,
            clientEmail: null,
            clientStreetAddress: null,
            clientCity: null,
            clientZipCode: null,
            clientCountry: null,
            invoiceDateUnix: null,
            invoiceDate: null,
            paymentTerms: '30',
            invoicePaid: null,
            paymentDueDateUnix: null,
            paymentDueDate: null,
            productDescription: null,
            invoicePending: null,
            invoiceDraft: null,
            invoiceItemList: [],
            invoiceTotal: 0,
        } as Invoice;
    },
    methods: {
        checkClick() {},
        saveDraft() {
          this.invoiceDraft = true;
        },
        publishInvoice() {
          this.invoicePending = true;

        },
        closeInvoice() {
            const modal = useInvoiceModal();
            modal.closeModal()
        },
        addNewInvoiceItem() {
            this.invoiceItemList.push({
                id: uid(),
                name: "",
                qty: 0,
                price: 0,
                total: 0,
            })
        },

        async uploadInvoice() {
          if (this.invoiceItemList.length <= 0) {
            alert("Please insure you filled out work items");
            return;
          }

          this.isLoading = true;

          this.calInvoiceTotal();

          await addDoc(collection(db, "invoices"), {
            invoiceId: uid(6),
            billerStreetAddress: this.billerStreetAddress,
            billerCity: this.billerCity,
            billerZipCode: this.billerZipCode,
            billerCountry: this.billerCountry,
            clientName: this.clientName,
            clientEmail: this.clientEmail,
            clientStreetAddress: this.clientStreetAddress,
            clientCity: this.clientCity,
            clientZipCode: this.clientZipCode,
            clientCountry: this.clientZipCode,
            invoiceDateUnix: this.invoiceDateUnix,
            invoiceDate: this.invoiceDate,
            paymentTerms: this.paymentTerms,
            paymentDueDateUnix: this.paymentDueDateUnix,
            paymentDueDate: this.paymentDueDate,
            productDescription: this.productDescription,
            invoicePending: this.invoicePending,
            invoiceDraft: this.invoiceDraft,
            invoiceItemList: this.invoiceItemList,
            invoiceTotal: this.invoiceTotal,
          });

          this.closeInvoice();

        },
        submitForm() {
          this.uploadInvoice();
        },
        deleteInvoiceItem(id: string) {
          this.invoiceItemList = this.invoiceItemList.filter((item) => id !== item.id);
        },
        calInvoiceTotal() {
          this.invoiceTotal = 0;
          this.invoiceItemList.forEach((item) => {
            this.invoiceTotal += item.total;
          })
        },
        updateFutureDate() {
            const futureDate = new Date();
            this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
            this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString('en-us', this.dateOptions);
        }
    },
    watch: {
        paymentTerms() {
            this.updateFutureDate();
        },
        isShowPopUp() {
          console.log(this.isShowPopUp);
        }
    }
}

</script>


<style lang="scss">

.add-item-button {
            justify-content: center;
            background-color: #562996;
            column-gap: 10px;
        }
        
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  z-index: 100;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      } }

      .work-items {

        .item-list {
          width: 100%;

          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
              cursor: pointer;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
</style>