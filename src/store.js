// store.js
import { reactive } from 'vue';

function loadAnnouncements() {
  const savedAnnouncements = localStorage.getItem('announcements');
  return savedAnnouncements ? JSON.parse(savedAnnouncements) : [];
}

export const store = reactive({
  announcements: loadAnnouncements(), // โหลดข้อมูลจาก Local Storage

  addAnnouncement(announcement) {
    announcement.id = Date.now().toString(); // สร้าง id ที่ไม่ซ้ำกัน
    console.log('Adding announcement:', announcement);
    this.announcements.unshift(announcement); // ประกาศใหม่อยู่่อับดับแรก
    localStorage.setItem('announcements', JSON.stringify(this.announcements)); // บันทึกข้อมูลลง Local Storage
    console.log('Current announcements after saving:', this.announcements);
  },

  deleteAnnouncement(index) {
    this.announcements.splice(index, 1);
    localStorage.setItem('announcements', JSON.stringify(this.announcements)); // delete ข้อมูล
    console.log('Current announcements after deletion:', this.announcements);
  },

  updateAnnouncement(index, updatedAnnouncement) {
    this.announcements[index] = updatedAnnouncement;
    localStorage.setItem('announcements', JSON.stringify(this.announcements)); // update ข้อมูล
    console.log('Current announcements after update:', this.announcements);
  }
});