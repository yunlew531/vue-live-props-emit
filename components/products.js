export default {
  props: {
    products: Array
  },
  emits: {
    handOpenProductModal: ({ action }) => typeof action === 'string',
    handOpenDelModal: ({ id, title }) => typeof id === 'string' && 
      typeof title === 'string' ? true : false,
  },
  template: `
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="200">產品評價</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td>
            <div v-if="!product.stars">
              <span v-for="(star, key) in 5" :key="key" @click="giveStars(product.id, key, 'outline')"
                class="material-icons text-warning btn p-0">star_outline
              </span>
            </div>
            <div v-else>
              <span v-for="(star, key) in product.stars" :key="star" @click="giveStars(product.id, key, 'solid')"
                class="material-icons text-warning btn p-0">star
              </span>
              <span v-for="(star, key) in 5 - product.stars" :key="key" @click="giveStars(product.id, key, 'outline')"
                class="material-icons text-warning btn p-0">star_outline
              </span>
            </div>
            {{ product.rate }}
          </td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else="product.is_enabled">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm"
                @click="$emit('handOpenProductModal', { action: 'edit', product })">
                編輯
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" @click="$emit('handOpenDelModal', product)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  methods: {
    giveStars(id, key, style) {
      if(style === 'outline') {
        this.products.forEach((product, idx) => {
          if (product.id === id) {
            this.products[idx].stars = this.products[idx].stars ? this.products[idx].stars + key + 1 : key + 1;
          }
        });
      } else if (style === 'solid') {
        this.products.forEach((product, idx) => {
          if (product.id === id) {
            this.products[idx].stars = key + 1;
          }
        });
      }
      const starsData = this.products.map(product => { return { id: product.id, stars: product.stars } });
      localStorage.setItem('productStars', JSON.stringify(starsData));
    }
  },
}