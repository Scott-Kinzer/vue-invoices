<template>
    <div>
    <div class="modal">
    </div>
    <div ref="modalPopUp" class="modal-content">
            <p>Are you sure you want exit? Your changes will not be saved</p>
            <div class="actions flex">
                <button @click="closeModal" class="purple">
                    Return
                </button>
                <button @click="closeInvoice" class="red">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useInvoiceModal, usePopModal } from '@/stores/modal';
import { onClickOutside, type MaybeElementRef, type MaybeElement } from '@vueuse/core';

export default {
  name: "modal",
  mounted() {
    onClickOutside(this.$refs.modalPopUp as MaybeElementRef<MaybeElement>, () => {
        this.closeModal();
    })
  },
  methods: {
    closeModal() {
        const {closePopModal} = usePopModal();
        closePopModal();
    },

    closeInvoice() {
        const {closePopModal} = usePopModal();
        const {closeModal} = useInvoiceModal();

        closePopModal();
        setTimeout(() => closeModal(), 150)
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  z-index: 150;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #252945;
  opacity: 0.5;
}

.modal-content {
    transform: translate(-50%, -50%);
    z-index: 200;
    position: fixed;
    top: 50%;
    left: 50%;
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    height: 230px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }

    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
</style>