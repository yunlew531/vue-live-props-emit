import { req, apiPath } from '../js/manage.js';

export default {
  props: {
    product: Object,
    modalAction: String,
    validateStatus: Boolean, 
  },
  emits: {
    handValidateStatus: status => typeof status === 'boolean',
    handMessage: msg => typeof msg === 'string',
    handCloseProductModal: () => true,
    handGetProducts: () => true,
  },
  template: `
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="productModalLabel" class="modal-title">
              <span>{{ modalAction }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-1">
                  <div class="form-group">
                    <label for="imageUrl">輸入圖片網址</label>
                    <input type="text" class="form-control" id="imageUrl"
                           placeholder="請輸入圖片連結" v-model.trim="tempProduct.imageUrl">
                  </div>
                  <img v-if="tempProduct.imageUrl" class="img-fluid mt-1" :src="tempProduct.imageUrl" alt="失效">
                </div>
                <div v-if="!tempProduct.imageUrl">
                  <input type="file" ref="imgUpload" @change="uploadImg">
                </div>
                <div v-else>
                  <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imageUrl = ''">
                    刪除圖片
                  </button>
                </div>
              </div>
              <form class="col-sm-8 needs-validation" :class="{'was-validated': validateStatus}" novalidate>
                <div class="form-group">
                  <label for="title">標題</label>
                  <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model.trim="tempProduct.title" required>
                  <p class="invalid-feedback">必填!</p>
                </div>

                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input id="category" type="text" class="form-control"
                           placeholder="請輸入分類" v-model.trim="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="unit">單位</label>
                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model.trim="tempProduct.unit" required>
                    <p class="invalid-feedback">必填!</p>
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="tempProduct.origin_price" required>
                    <p class="invalid-feedback">必填!</p>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input id="price" type="number" min="0" class="form-control"
                           placeholder="請輸入售價" v-model.number="tempProduct.price" required>
                           <p class="invalid-feedback">必填!</p>
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea id="description" type="text" class="form-control"
                            placeholder="請輸入產品描述" v-model.trim="tempProduct.description">
                  </textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea id="content" type="text" class="form-control"
                            placeholder="請輸入說明內容" v-model.trim="tempProduct.content">
                  </textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input id="is_enabled" class="form-check-input" type="checkbox"
                           :true-value="1" :false-value="0" v-model.trim="tempProduct.is_enabled">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="reqProduct">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      tempProduct: { ...this.product },
      productModal: null,
    }
  },
  watch: {
    product: {
      handler() {
        this.tempProduct = { ...this.product };
      },
      deep: true,
    },
  },
  methods: {
    async uploadImg() {
      const file = this.$refs.imgUpload.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', file);
      try {
        const { data } = await req.post(`/api/${apiPath}/admin/upload`, formData);
        if (data.success) {
          this.$emit('handMessage', '上傳成功');
          this.tempProduct.imageUrl = data.imageUrl;
        } else {
          this.$emit('handMessage', data.message);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async reqProduct() {
      const api = this.modalAction === '新增產品' ? 
      `/api/${apiPath}/admin/product` :
      `/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      const method = this.modalAction === '新增產品' ? 'post' : 'put';
      this.$emit('handValidateStatus', true);
      const { title, category, unit, origin_price, price } = this.tempProduct;
      if (!title || !category || !unit || !origin_price || !price) return;
      try {
        const { data } = await req[method](api, { data: this.tempProduct });
        if (data.success) {
          this.$emit('handValidateStatus', false);
          this.productModal.hide();
          this.$emit('handMessage', data.message);
        } else {
          this.$emit('handMessage', data.message);
        }
      }
      catch(err) {
        console.dir(err);
      }
      this.$emit('handGetProducts');
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModal, { keyboard: false });
  },
}