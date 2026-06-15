<template>
  <el-dialog
    v-model="visible"
    title="发布课程"
    width="560px"
    :close-on-click-modal="false"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-position="right"
    >
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="form.title" maxlength="120" show-word-limit placeholder="例如：晨间力量唤醒" />
      </el-form-item>

      <el-form-item label="课程介绍" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="2000"
          show-word-limit
          placeholder="描述课程特点、适合人群等"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="时长" prop="duration">
            <el-input-number v-model="form.duration" :min="15" :max="240" :step="15" controls-position="right" style="width: 100%" />
            <span class="unit">分钟</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="form.price" :min="0" :step="10" controls-position="right" style="width: 100%" />
            <span class="unit">元</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最多人数" prop="maxCapacity">
            <el-input-number v-model="form.maxCapacity" :min="1" :max="99" controls-position="right" style="width: 100%" />
            <span class="unit">人</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="训练部位" prop="bodyParts">
        <el-checkbox-group v-model="form.bodyParts">
          <el-checkbox
            v-for="bp in ALL_BODY_PARTS"
            :key="bp"
            :value="bp"
            :label="bp"
          >
            {{ BodyPartLabel[bp] }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="排期时间" prop="schedule">
        <div class="schedule-wrap">
          <div v-for="(slot, index) in form.schedule" :key="index" class="schedule-row">
            <el-date-picker
              v-model="form.schedule[index]"
              type="datetime"
              placeholder="选择上课时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              style="width: 100%"
            />
            <el-button
              type="danger"
              link
              :disabled="form.schedule.length <= 1"
              @click="removeSchedule(index)"
            >
              删除
            </el-button>
          </div>
          <el-button type="primary" link :icon="Plus" @click="addSchedule">
            添加时间段
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">发布课程</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@lucide/vue'
import { ALL_BODY_PARTS, BodyPartLabel } from '@/constants/course'
import { useCourseStore } from '@/stores/courseStore'
import type { BodyPartValue } from '@/constants/course'
import type { Course } from '@/types/domain'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: [course: Course]
}>()

const courseStore = useCourseStore()

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => (visible.value = v))
watch(visible, v => emit('update:modelValue', v))

const formRef = ref<FormInstance>()
const submitting = ref(false)

function defaultForm() {
  return {
    title: '',
    description: '',
    duration: 60,
    price: 188,
    maxCapacity: 6,
    bodyParts: [] as BodyPartValue[],
    schedule: [''] as (string | undefined)[]
  }
}

const form = reactive(defaultForm())

const rules: FormRules = {
  title: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 120, message: '长度在 2 到 120 个字符', trigger: 'blur' }
  ],
  duration: [{ required: true, message: '请输入课程时长', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  maxCapacity: [{ required: true, message: '请输入最大人数', trigger: 'blur' }],
  schedule: [
    {
      required: true,
      validator: (_rule, value, callback) => {
        const valid = Array.isArray(value) && value.some(v => typeof v === 'string' && v.length > 0)
        valid ? callback() : callback(new Error('请至少设置一个上课时间'))
      },
      trigger: 'change'
    }
  ]
}

function addSchedule() {
  form.schedule.push('')
}

function removeSchedule(index: number) {
  form.schedule.splice(index, 1)
}

function handleClosed() {
  Object.assign(form, defaultForm())
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  await formRef.value?.validate()
  const payload = {
    ...form,
    schedule: form.schedule.filter((s): s is string => typeof s === 'string' && s.length > 0)
  }
  try {
    submitting.value = true
    const created = await courseStore.create(payload)
    ElMessage.success('课程发布成功')
    visible.value = false
    emit('success', created)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.unit {
  margin-left: 4px;
  color: var(--muted);
  font-size: 13px;
}

.schedule-wrap {
  width: 100%;
  display: grid;
  gap: 8px;
}

.schedule-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.schedule-row > :first-child {
  flex: 1;
}
</style>
