<template>
  <div class="section-band">
    <section class="panel">
      <div class="toolbar toolbar-main">
        <el-input v-model="courseStore.keyword" clearable placeholder="搜索课程、教练或训练目标" :prefix-icon="Search" @keyup.enter="courseStore.loadCourses" />
        <el-select v-model="courseStore.coachId" clearable placeholder="教练筛选" style="width: 220px" @change="courseStore.loadCourses">
          <el-option v-for="coach in userStore.coaches" :key="coach.id" :label="coach.nickname" :value="coach.id" />
        </el-select>
        <el-button type="primary" :icon="SlidersHorizontal" @click="courseStore.loadCourses">筛选</el-button>
        <el-button :icon="RotateCcw" @click="resetFilters">重置</el-button>
        <RoleGuard :roles="[UserRole.COACH, UserRole.ADMIN]">
          <el-button type="success" :icon="Plus" @click="showCreateDialog = true">发布课程</el-button>
        </RoleGuard>
      </div>

      <div class="toolbar toolbar-filter">
        <div class="filter-label">训练部位：</div>
        <div class="body-parts-filter">
          <el-tag
            v-for="bp in ALL_BODY_PARTS"
            :key="bp"
            :class="['body-part-tag', { active: courseStore.bodyParts.includes(bp) }]"
            :style="courseStore.bodyParts.includes(bp) ? { background: BodyPartColor[bp], borderColor: BodyPartColor[bp], color: '#fff' } : {}"
            @click="toggleBodyPart(bp)"
            disable-transitions
          >
            {{ BodyPartLabel[bp] }}
          </el-tag>
          <el-button
            v-if="courseStore.bodyParts.length > 0"
            link
            type="primary"
            size="small"
            @click="clearBodyParts"
          >
            清除部位
          </el-button>
        </div>
      </div>
    </section>

    <section v-if="courseStore.list.length" class="grid-2">
      <CourseCard v-for="course in courseStore.list" :key="course.id" :course="course" @book="bookCourse" />
    </section>
    <EmptyState v-else title="没有匹配课程" description="换一个训练目标、部位或教练再筛选" />

    <CourseFormDialog v-model="showCreateDialog" @success="handleCreateSuccess" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, RotateCcw, Search, SlidersHorizontal } from '@lucide/vue'
import CourseCard from '@/components/common/CourseCard.vue'
import CourseFormDialog from '@/components/common/CourseFormDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import RoleGuard from '@/components/common/RoleGuard'
import { ALL_BODY_PARTS, BodyPartColor, BodyPartLabel } from '@/constants/course'
import { UserRole } from '@/constants/user'
import { useBookingStore } from '@/stores/bookingStore'
import { useCourseStore } from '@/stores/courseStore'
import { useUserStore } from '@/stores/userStore'
import type { BodyPartValue } from '@/constants/course'
import type { Course } from '@/types/domain'

const courseStore = useCourseStore()
const bookingStore = useBookingStore()
const userStore = useUserStore()

const showCreateDialog = ref(false)

function toggleBodyPart(bp: BodyPartValue) {
  const idx = courseStore.bodyParts.indexOf(bp)
  if (idx >= 0) {
    courseStore.bodyParts.splice(idx, 1)
  } else {
    courseStore.bodyParts.push(bp)
  }
  courseStore.loadCourses()
}

function clearBodyParts() {
  courseStore.bodyParts = []
  courseStore.loadCourses()
}

function resetFilters() {
  courseStore.clearFilters()
  courseStore.loadCourses()
}

async function bookCourse(course: Course, scheduleTime: string) {
  await bookingStore.create(course.id, scheduleTime)
  ElMessage.success(`预约已提交：${course.title}`)
}

function handleCreateSuccess() {
  courseStore.loadCourses()
}

onMounted(async () => {
  await Promise.all([courseStore.loadCourses(), userStore.loadCoaches()])
})
</script>

<style scoped>
.toolbar-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-filter {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--line);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.filter-label {
  flex: 0 0 auto;
  color: var(--muted);
  font-size: 13px;
  line-height: 28px;
}

.body-parts-filter {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.body-part-tag {
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  font-size: 12px;
}

.body-part-tag:not(.active):hover {
  border-color: var(--accent);
  color: var(--accent);
}

.body-part-tag.active {
  font-weight: 600;
}
</style>
