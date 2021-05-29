export default {
  props: {
    pagination: Object,
  },
  emits: {
    handPage: page => typeof page === 'number',
  },
  template: `
    <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled' : pagination.current_page === 1}" @click="$emit('handPage', pagination.current_page - 1)">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="page in pagination.total_pages" :key="page" class="page-item"
        :class="{'active' : page === pagination.current_page}"
        @click="$emit('handPage', page)">
        <a class="page-link" href="javascript:;">{{ page }}</a>
      </li>
      <li class="page-item" :class="{'disabled' : pagination.current_page === pagination.total_pages}"
        @click="$emit('handPage', pagination.current_page + 1)">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
}