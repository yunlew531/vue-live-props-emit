export default {
  props: {
    messageText: String,
  },
  template: `
    <div id="messageModal" ref="messageModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body text-center py-5">
            <span class="fs-2">{{ messageText }}</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      messageModal: null,
    }
  },
  mounted() {
    this.messageModal = new bootstrap.Modal(this.$refs.messageModal, { keyboard: false });
  },
}