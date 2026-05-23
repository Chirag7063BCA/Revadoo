// post.js — Updated Sanity schema
// New fields added:
//   videoUrl      — YouTube or Vimeo embed URL (displayed below article body)
//   videoCaption  — Caption shown under the video
//   sidebarText   — Array of short tip strings that rotate in the sidebar
//   sidebarLabel  — Label for the rotating text widget (e.g. "Quick Tip", "Did You Know?")

export default {
  name:  'post',
  title: 'Blog Post',
  type:  'document',
  fields: [
    /* ── Core ── */
    { name: 'title',       title: 'Title',           type: 'string' },
    { name: 'slug',        title: 'Slug',            type: 'slug',     options: { source: 'title' } },
    { name: 'tag',         title: 'Tag / Category',  type: 'string' },
    { name: 'tagColor',    title: 'Tag Color (hex)',  type: 'string' },
    { name: 'desc',        title: 'Short Description',type: 'text' },

    /* ── Author ── */
    { name: 'author',      title: 'Author Name',     type: 'string' },
    { name: 'avatar',      title: 'Author Avatar',   type: 'image'  },

    /* ── Media ── */
    { name: 'mainImage',   title: 'Main Image',      type: 'image',    options: { hotspot: true } },

    /* ── NEW: Video embed ──
       Paste a full YouTube (https://www.youtube.com/watch?v=...) or
       Vimeo (https://vimeo.com/...) URL. The blog will auto-convert it
       to the correct iframe embed URL. */
    {
      name:        'videoUrl',
      title:       'Video URL (YouTube / Vimeo)',
      type:        'url',
      description: 'Optional. Paste a YouTube watch URL or Vimeo URL. Displayed below the article body.',
    },
    {
      name:        'videoCaption',
      title:       'Video Caption',
      type:        'string',
      description: 'Short caption shown beneath the video embed.',
    },

    /* ── NEW: Rotating sidebar tips ──
       Add 3–8 short tips (1–2 sentences each). The sidebar widget
       will cycle through them every 4 seconds while the reader scrolls. */
    {
      name:        'sidebarText',
      title:       'Rotating Sidebar Tips',
      type:        'array',
      of:          [{ type: 'string' }],
      description: 'Add 3–8 short tips or facts. These rotate in the sidebar while the reader scrolls the article.',
    },
    {
      name:        'sidebarLabel',
      title:       'Sidebar Tip Label',
      type:        'string',
      description: 'Label shown above the rotating tips. E.g. "Quick Tip", "Did You Know?", "Pro Move".',
      initialValue: 'Quick Tip',
    },

    /* ── Meta ── */
    { name: 'publishedAt', title: 'Published At',    type: 'datetime' },
    { name: 'readTime',    title: 'Read Time',       type: 'string' },
    { name: 'comingSoon',  title: 'Coming Soon?',    type: 'boolean' },
    { name: 'featured',    title: 'Featured Post?',  type: 'boolean' },

    /* ── Article body ── */
    {
      name:  'body',
      title: 'Article Body',
      type:  'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt',     type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption'  },
          ],
        },
      ],
    },
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'tag',
      media:    'mainImage',
    },
  },
};