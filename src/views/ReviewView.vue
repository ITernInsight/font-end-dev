<script setup lang="ts">
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

const reviews = [
  {
    Review_ID: 0,
    Title: 'Review#1',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Description Description Description Description',
  },
  {
    Review_ID: 1,
    Title: 'Review#2',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Description Description Description Description',
  },
  {
    Review_ID: 2,
    Title: 'Review#3',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Annouce Annouce Annouce Annouce Annouce',
  },
  {
    Review_ID: 3,
    Title: 'Review#4',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Annouce Annouce Annouce Annouce Annouce',
  },
  {
    Review_ID: 4,
    Title: 'Review#5',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Annouce Annouce Annouce Annouce Annouce',
  },
  {
    Review_ID: 5,
    Title: 'Review#6',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Annouce Annouce Annouce Annouce Annouce',
  },
  {
    Review_ID: 6,
    Title: 'Review#7',
    Date: new Date('2023-09-01T14:30:00Z'),
    Description: ' Annouce Annouce Annouce Annouce Annouce',
  },
]
</script>

<template>
  <div
    class="font-Prompt px-2 space-y-2 mt-2 w-full sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <div class="flex flex-wrap justify-around gap-x-1 gap-y-2">
      <div
        v-for="(post, index) in reviews"
        :key="index"
        class="flex flex-col items-start font-Prompt border-border border rounded-md gap-y-2 p-2 w-2/3 md:w-[45%] lg:w-[32%]"
      >
        <span class="text-sm text-hightlight font-bold">
          {{ post.Title }}
        </span>
        <span class="text-xs text-hightlight font-bold">
          {{ formatDate(post.Date) }}
        </span>
        <span class="text-xs text-text">
          {{ post.Description }}
        </span>
        <RouterLink
          :to="`posts/${post.Review_ID}`"
          class="text-xs font-medium text-white bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:text-sm lg:text-base"
        >
          Read more
        </RouterLink>
      </div>
    </div>
  </div>
</template>
