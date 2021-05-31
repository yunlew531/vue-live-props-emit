import { req, apiPath } from '../js/manage.js';

export default {
  props: {
    tempId: String,
    tempDelProduct: Object,
  },
  emits: {
    handMessage: data => typeof data === 'string',
    handCloseDelModal: () => true,
    handGetProducts: () => true,
  },
  template: `
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
         aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品 {{ tempDelProduct.title }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger"></strong> 商品 {{ tempDelProduct.title }}(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      delProductModal: null,
    }
  },
  methods: {
    async deleteProduct() {
      this.delProductModal.hide();
      try {
        const { data } = await req.delete(`/api/${apiPath}/admin/product/${this.tempDelProduct.id}`);
        if (data.success) {
          this.$emit('handMessage', data.message);
          this.$emit('handGetProducts');
        } else {
          this.$emit('handMessage', data.message);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
  },
  mounted() {
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal, { keyboard: false });
  },
}