// Creates (or resets) a demo account with sample folders and notes, for screenshots and the public demo.
// Usage: MONGODB_URI=... DEMO_EMAIL=... DEMO_PASSWORD=... npm run seed:demo
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Folder from '../src/models/Folder.js';
import Note from '../src/models/Note.js';

dotenv.config();

const email = process.env.DEMO_EMAIL || 'demo@tickdown.app';
const password = process.env.DEMO_PASSWORD;
if (!password) {
  console.error('Set DEMO_PASSWORD (at least 6 characters).');
  process.exit(1);
}

const tasks = (items) =>
  `<ul data-type="taskList">${items
    .map(([done, text]) => `<li data-type="taskItem" data-checked="${done}"><p>${text}</p></li>`)
    .join('')}</ul>`;

const folders = [
  { name: 'Work', color: '#A8FF3E' },
  { name: 'Home', color: '#FFD60A' },
  { name: 'Ideas', color: '#5AC8FA' },
];

const notes = [
  {
    folder: 'Work', pinned: true, title: 'Website launch checklist', tags: ['launch'],
    content: `<p>Go-live for the new marketing site on Friday.</p>${tasks([
      [false, 'Point DNS to the new server'],
      [false, 'Check forms and thank-you pages'],
      [false, 'Submit the sitemap in Search Console'],
      [true, 'Set up 301 redirects from old URLs'],
      [true, 'Run Lighthouse on key pages'],
      [true, 'Back up the old site'],
    ])}`,
  },
  {
    folder: 'Work', title: 'Client call notes', tags: ['client'],
    content: '<h3>Q4 priorities</h3><p>They want the <mark>pricing page</mark> rebuilt before the holiday campaign, then a speed pass on the blog.</p><ul><li><p>Send a quote by Wednesday</p></li><li><p>Ask for Figma access</p></li></ul>',
  },
  {
    folder: 'Home', pinned: true, title: 'Groceries', tags: [],
    content: tasks([
      [false, 'Coffee beans'],
      [false, 'Avocados'],
      [false, 'Greek yogurt'],
      [true, 'Bread'],
      [true, 'Eggs'],
    ]),
  },
  {
    folder: 'Home', title: 'Weekend', tags: [],
    content: tasks([
      [true, 'Fix the garden hose'],
      [true, 'Call mom'],
      [true, 'Return library books'],
    ]),
  },
  {
    folder: 'Ideas', title: 'App ideas', tags: ['side project'],
    content: '<p>Things worth building one day:</p><ul><li><p>A <strong>speed checker</strong> that explains Lighthouse in plain words</p></li><li><p>Shared shopping lists with live sync</p></li></ul>',
  },
];

await mongoose.connect(process.env.MONGODB_URI);

const old = await User.findOne({ email });
if (old) {
  await Note.deleteMany({ userId: old._id });
  await Folder.deleteMany({ userId: old._id });
  await old.deleteOne();
}

const user = await User.create({ name: 'Demo', email, password });
const folderIds = {};
for (const f of folders) {
  folderIds[f.name] = (await Folder.create({ ...f, userId: user._id }))._id;
}
for (const n of notes) {
  await Note.create({
    userId: user._id,
    folderId: folderIds[n.folder],
    title: n.title,
    // Like a real note, the first line is the title; the editor derives the title from it.
    content: `<h2>${n.title}</h2>${n.content}`,
    tags: n.tags,
    isPinned: Boolean(n.pinned),
  });
}

console.log(`Demo account ready: ${email} with ${folders.length} folders and ${notes.length} notes.`);
await mongoose.disconnect();
