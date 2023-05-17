import type { Invoice } from '@/components/InvoiceModal.vue';
import { defineStore } from 'pinia'

export const useInvoiceModal = defineStore('invoiceModal', {
  state: () => {
    return { isModalOpen: false }
  },
  actions: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      const { clearInvoice } = useModalDetails();
      clearInvoice();
      this.isModalOpen = false;
    }
  },
});

export const usePopModal = defineStore('popModal', {
  state: () => {
    return { isPopModalOpen: false }
  },
  actions: {
    openPopModal() {
      this.isPopModalOpen = true;
    },
    closePopModal() {
      this.isPopModalOpen = false;
    }
  },
});

export const emptyInvoice = {
  invoiceId: '',
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
}

export const useModalDetails = defineStore('invoiceModalDetails', {
  state: () => {
    return { invoiceInfo: emptyInvoice } as {invoiceInfo: (Invoice & {invoiceId: string})}
  },
  actions: {
    setInvoice(invoice: (Invoice & {invoiceId: string})) {
      this.invoiceInfo = invoice;
    },
    clearInvoice() {
      this.invoiceInfo = emptyInvoice;
    }
  },
});


