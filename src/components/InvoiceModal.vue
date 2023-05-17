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
                    <input required type="text" id="billerStreetAddress" v-model="invoice.billerStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="billerCity">City</label>
                    <input required type="text" id="billerCity" v-model="invoice.billerCity">
                </div>
                <div class="input flex flex-column">
                    <label for="billerZipCode">Zip code</label>
                    <input required type="text" id="billerZipCode" v-model="invoice.billerZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="billerCountry">Country</label>
                    <input required type="text" id="billerCountry" v-model="invoice.billerCountry">
                </div>
                </div>
            </div>



            <div class="bill-to flex flex-column">
                <h4>Bill to</h4>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="clientName">Client name</label>
                    <input required type="text" id="clientName" v-model="invoice.clientName">
                </div>
                <div class="input flex flex-column">
                    <label for="clientEmail">Client email</label>
                    <input required type="text" id="clientEmail" v-model="invoice.clientEmail">
                </div>
                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Street address</label>
                    <input required type="text" id="clientStreetAddress" v-model="invoice.clientStreetAddress">
                </div>
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                    <label for="clientCity">City</label>
                    <input required type="text" id="clientCity" v-model="invoice.clientCity">
                </div>
                <div class="input flex flex-column">
                    <label for="clientZipCode">Zip code</label>
                    <input required type="text" id="clientZipCode" v-model="invoice.clientZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="clientCountry">Country</label>
                    <input required type="text" id="clientCountry" v-model="invoice.clientCountry">
                </div>
                </div>
            </div>


                <div class="invoice-work flex flex-column">
                    <div class="payment flex">
                        <div class="input flex flex-column">
                            <label for="invoiceDate">Invoice date</label>
                            <input disabled type="text" id="invoiceDate" v-model="invoice.invoiceDate">
                        </div>
                        <div class="input flex flex-column">
                            <label for="paymentDueDate">Payment due</label>
                            <input disabled type="text" id="paymentDueDate" v-model="invoice.paymentDueDate">
                        </div>
                    </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment terms</label>
                    <select required type="text" id="paymentTerms" v-model="invoice.paymentTerms">
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
                    <input required type="text" id="productDescription" v-model="invoice.productDescription">
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
                        <tr class="table-items flex" v-for="(item, index) in invoice.invoiceItemList" :key="index">
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
                    <button @click="saveDraft" type="button" class="dark-purple"  :class="{ 'is-draft': invoice.invoiceDraft }">
                        Save draft
                    </button>
                    <button v-if="!invoice.invoiceId" type="submit" class="purple">
                        Create Invoice
                    </button>
                    <button v-if="invoice.invoiceId" type="submit" class="purple">
                        Edit Invoice
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { useInvoiceModal, useModalDetails } from '@/stores/modal';
import { usePopModal } from '@/stores/modal';
import { onClickOutside, type MaybeElementRef, type MaybeElement } from '@vueuse/core';
import {uid} from 'uid';
import {db, collection, addDoc, query, where, getDocs, updateDoc} from '../firebase/firebase.init';
import Loading from '../components/Loading.vue';
import Modal from './Modal.vue';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';


export type Invoice = {
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
        this.invoice.invoiceDateUnix = Date.now();
        this.invoice.invoiceDate = new Date(this.invoice.invoiceDateUnix).toLocaleDateString('en-us', this.dateOptions);

        this.updateFutureDate();
    },
    data() {
      const popUpModal = usePopModal();
      const storePopUp = storeToRefs(popUpModal);
      const { invoiceInfo } = useModalDetails();

        return {
            isShowPopUp: storePopUp.isPopModalOpen,
            isLoading: false,
            dateOptions: { year: "numeric", month: "short", day: "numeric" },
            loading: null,
            invoice: invoiceInfo
        } as {
          invoice: (Invoice & {invoiceId: string});  
          isLoading: boolean; 
          loading: null | boolean;   
          dateOptions: { year: "numeric"; month: "short"; day: "numeric" };
          isShowPopUp: Ref<boolean>;
          };
    },
    methods: {
        checkClick() {},
        saveDraft() {
          this.invoice.invoiceDraft = !this.invoice.invoiceDraft;
          this.invoice.invoicePending = false;
          this.invoice.invoicePaid = false;
        },
        publishInvoice() {
          this.invoice.invoicePending = true;
          this.invoice.invoiceDraft = false;
          this.invoice.invoicePaid = false;
        },
        closeInvoice() {
            const modal = useInvoiceModal();
            modal.closeModal()
        },
        addNewInvoiceItem() {
            this.invoice.invoiceItemList.push({
                id: uid(),
                name: "",
                qty: 0,
                price: 0,
                total: 0,
            })
        },

        async uploadInvoice() {
          if (this.invoice.invoiceItemList.length <= 0) {
            alert("Please insure you filled out work items");
            return;
          }

          this.isLoading = true;

          this.calInvoiceTotal();

          if (!this.invoice.invoiceId) {
            await addDoc(collection(db, "invoices"), {
            ...this.invoice,
            invoiceId: uid(6),
          });
          } else {
            const q = query(collection(db, "invoices"), where("invoiceId", "==", this.$route.params.invoiceId as string));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              ...this.invoice,
              });
            });
          }

          this.closeInvoice();

        },
        submitForm() {
          this.uploadInvoice();
        },
        deleteInvoiceItem(id: string) {
          this.invoice.invoiceItemList = this.invoice.invoiceItemList.filter((item) => id !== item.id);
        },
        calInvoiceTotal() {
          this.invoice.invoiceTotal = 0;
          this.invoice.invoiceItemList.forEach((item) => {
            this.invoice.invoiceTotal += item.total;
          })
        },
        updateFutureDate() {
            const futureDate = new Date();
            this.invoice.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.invoice.paymentTerms));
            this.invoice.paymentDueDate = new Date(this.invoice.paymentDueDateUnix).toLocaleDateString('en-us', this.dateOptions);
        }
    },
    watch: {
        paymentTerms() {
            this.updateFutureDate();
        },
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

  .is-draft {
    background-color: green !important;
  }
</style>