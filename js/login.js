import messageModal from '../components/messageModal.js';

const req = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io',
  headers: { common: {} },
});
const app = Vue.createApp({
  components: {
    messageModal,
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isValidate: false,
      messageModal: null,
      messageText: '',
    };
  },
  methods: {
    async checkLogin() {
      try {
        const { data } = await req.post('/api/user/check');
        if (data.success) {
          this.handMessage('已登入!跳轉中');
          setTimeout(() => {
            window.location.href = './manage.html';
          }, 3000);
        }
      }
      catch(err) {
        console.dir(err);
      }
    },
    async login() {
      this.isValidate = true;
      const user = {
        ...this.user
      };
      for (const props in user) {
        if (!user[props]) return;
      }
      try {
        const { data } = await req.post('/admin/signin', user);
        if (data.success) {
          const token = data.token;
          const expired = new Date(data.expired);
          document.cookie = `Hegoze=${token}; expires=${expired}`;
          window.location.href = './manage.html';
        } else {
          this.handMessage(data.message);
        }
      }
      catch (err) {
        console.dir(err);
      }
    },
    handMessage(msg) {
      this.messageText = msg;
      this.messageModal.show();
      setTimeout(() => {
        this.messageModal.hide();
      }, 3000);
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)Hegoze\s*=\s*([^;]*).*$)|^.*$/, '$1');
    req.defaults.headers.common['Authorization'] = token;
  },
  mounted() {
    this.messageModal = new bootstrap.Modal(document.querySelector('#messageModal'), { keyboard: false });
    this.checkLogin();
  },
}).mount('#app');
