import controlBtn from '../components/controlBtn.js';
import products from '../components/products.js';
import pagination from '../components/pagination.js';
import tempProductModal from '../components/tempProductModal.js';
import deleteModal from '../components/deleteModal.js';
import messageModal from '../components/messageModal.js';

export const req = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io',
  headers: { common: {} },
});
export const apiPath = 'yunlew';

const app = Vue.createApp({
  components: {
    products,
    pagination,
    controlBtn,
    tempProductModal,
    deleteModal,
    messageModal,
  },
  data() {
    return {
      productsData: [],
      productModal: null,
      delProductModal: null,
      messageModal: null,
      messageText: '',
      tempId: '',
      tempProduct: {},
      validateStatus: false,
      tempDelProduct: '',
      modalAction: '',
      pagination: {},
    };
  },
  methods: {
    async checkLogin() {
      try {
        const { data } = await req.post('/api/user/check');
        if (data.success) {
          this.getProducts();
        } else {
          this.handMessage(data.message);
          setTimeout(() => {
            window.location.href = './index.html';
          }, 3000);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async logout() {
      try {
        const { data } = await req.post('/logout');
        if (data.success) {
          this.handMessage(data.message);
          document.cookie = `Hegoze=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          setTimeout(() => {
            window.location.href = './index.html';
          }, 3000);
        } else {
          this.handMessage(data.message);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async getProducts(page = 1) {
      try {
        const { data } = await req.get(`/api/${apiPath}/admin/products?page=${page}`);
        this.productsData = data.products;
        this.pagination = data.pagination;
        this.setStars(this.productsData);
      }
      catch(err) {
        console.dir(err);
      }
    },
    setStars(data) {
      const productStars = JSON.parse(localStorage.getItem('productStars')) || [];
      data.forEach(product => {
        productStars.forEach(item => {
          if (product.id === item.id)
            product.stars = item.stars;
        });
      });
    },
    openProductModal({ action, product }) {
      this.handValidateStatus(false);
      this.modalAction = action === 'new' ? '新增產品' : '編輯產品';
      this.tempProduct = action === 'edit' ? { ...product } : {};
      this.tempId = product?.id;
      this.productModal.show();
    },
    closeProductModal() {
      this.productModal.hide();
      this.resetModal();
    },
    openDelModal({title, id}) {
      this.tempId = id;
      this.tempDelProduct = title;
      this.delProductModal.show();
    },
    closeDelModal() {
      this.delProductModal.hide();
    },
    resetModal() {
      this.tempProduct = {};
      this.tempId = '';
      this.handValidateStatus(false);
    },
    handPage(page) {
      if (page < 0) page = 1;
      else if (page > this.pagination.total_pages)
        page = this.pagination.total_pages;
      this.getProducts(page);
    },
    handValidateStatus(status) {
      this.validateStatus = status;
    },
    handMessage(msg) {
      this.messageModal.show();
      this.messageText = msg;
      setTimeout(() => {
        this.messageModal.hide();
      }, 3000);
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    req.defaults.headers.common['Authorization'] = token;
    this.checkLogin();
  },
  mounted() {
    this.productModal = new bootstrap.Modal(document.querySelector('#productModal'), { keyboard: false });
    this.delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), { keyboard: false });
    this.messageModal = new bootstrap.Modal(document.querySelector('#messageModal'), { keyboard: false });
  },
})
.mount('#app');
