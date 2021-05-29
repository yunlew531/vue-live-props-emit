export default {
  emits: {
    handOpenProductModal: (data) => typeof data.action === 'string',
    handLogout: () => true,
  },
  template: `
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="$emit('handOpenProductModal', { action: 'new' })">
        建立新的產品
      </button>
      <button class="btn btn-outline-dark mx-1" @click="$emit('handLogout')">
        登出
      </button>
    </div>
  `,
}