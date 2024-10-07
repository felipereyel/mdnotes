import type { JSX } from 'hono/jsx';
import { marked } from "marked";

const page = (title: string, Child: JSX.HTMLAttributes) => (
  <html>
    <head>
      <title>{title} | MDNotes</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        src="https://unpkg.com/htmx.org@1.9.6"
        integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
        crossorigin="anonymous"
      ></script>
      <link rel="stylesheet" href="https://unpkg.com/@tailwindcss/typography@0.1.2/dist/typography.min.css"></link>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <style>
        {".recwhite * { color: red; }"}
      </style>
    </head>
    <body id="body" class="bg-slate-900 text-white max-h-full">
      {Child}
    </body>
  </html>
);

export const NewPopup = () => (
  <div
    id="modal"
    hx-get="/_ok"
    hx-target="#modal"
    hx-swap="delete"
    hx-trigger="click target:#modal"
    class="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full md:inset-0 max-h-full backdrop-blur-sm"
  >
    <div id="modal-content" class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-indigo-700">
        <div class="flex items-center justify-between p-2 border-b rounded-t dark:border-indigo-800">
          <h3 class="text-xl font-semibold text-indigo-900 dark:text-white">New Note</h3>
          <button
            hx-get="/_ok"
            hx-target="#modal"
            hx-swap="delete"
            type="button"
            class="text-white bg-transparent hover:bg-indigo-200 hover:text-indigo-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-indigo-800 dark:hover:text-white"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="px-2 pt-4 pb-1">
          <form hx-post="/new" hx-target="#modal" hx-swap="delete">
            <div class="flex flex-row items-center justify-between h-10 space-x-2">
              <input
                name="name"
                id="name"
                placeholder="Name"
                class="bg-slate-900 border border-indigo-300 text-indigo-900 text-sm rounded block w-full p-2.5 dark:bg-indigo-800 dark:border-indigo-500 dark:placeholder-indigo-400 dark:text-white"
                required
              ></input>
              <button
                type="submit"
                class="w-10 h-full text-white text-center bg-indigo-800 hover:bg-sky-100 hover:text-sky-900 border border-slate-500 rounded overflow-hidden shadow-md"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const NewButton = () => (
  <div
    class="text-white text-center bg-indigo-800 hover:bg-sky-100 hover:text-sky-900 border border-slate-300 rounded shadow-md cursor-pointer w-7 h-7"
    hx-get="/_new"
    hx-target="#body"
    hx-swap="beforeend"
  >
    <span class="material-symbols-outlined">add</span>
  </div>
);

export const Sidebar = (props: { paths: string[] }) => (
  <div id="drawer-navigation" class="fixed top-0 left-0 z-40 w-64 px-4 pt-1 overflow-y-auto bg-white dark:bg-indigo-800 flex flex-col justify-between h-full">
    <div
      class="text-white text-center bg-indigo-800 hover:bg-sky-100 hover:text-sky-900 border border-slate-300 rounded shadow-md cursor-pointer w-7 h-7"
      hx-get="/_ok"
      hx-target="#drawer-navigation"
      hx-swap="delete"
    >
      <span class="material-symbols-outlined">chevron_left</span>
    </div>
    <div class="py-4 overflow-y-auto h-full">
      <ul class="space-y-2 font-medium">
        {props.paths.map((path) => (
          <li class="cursor-pointer">
            <a href={"/" + path} class="flex items-center p-2 text-indigo-900 rounded-lg dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-700 group">
              <span class="ms-3">{path}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div >
);

const SidebarButton = () => (
  <div
    class="text-white text-center bg-indigo-800 hover:bg-sky-100 hover:text-sky-900 border border-slate-300 rounded shadow-md cursor-pointer w-7 h-7"
    hx-get="/_sidebar"
    hx-target="#body"
    hx-swap="beforeend"
  >
    <span class="material-symbols-outlined">chevron_right</span>
  </div>
);

const BaseLayout = (props: { title: string, Child: JSX.HTMLAttributes }) => page(props.title,
  <div class="flex flex-col w-full h-full">
    <div class="h-10 w-full bg-indigo-800 flex flex-row items-center px-4 justify-between">
      <SidebarButton />
      <div class="dark:text-white font-semibold text-gray-500 dark:text-gray-400 flex flex-row items-center">
        <a href="/" class="text-lg">
          MDNotes
        </a>
        <span class="mx-2">/</span>
        <h5 class="text-base">
          {props.title}
        </h5>
      </div>
      <NewButton />
    </div>
    <div class="h-full w-full flex flex-row items-center">
      {props.Child}
    </div>
  </div>
);

export const Home = () => BaseLayout({
  title: 'Home', Child:
    <div class="flex flex-col items-center justify-center w-full h-full">
      <h1 class="text-4xl font-bold text-white mb-4">MDNotes</h1>
    </div>
});

const TextAreaEditor = (props: { path: string, content: string }) => (
  <textarea
    id="editor"
    class="w-full h-full p-4 bg-slate-900 text-white"
    hx-post={`/${props.path}`}
    hx-trigger="input"
    name="content"
  >
    {props.content}
  </textarea>
);

export const NoteEditor = (path: string, content: string) => BaseLayout({
  title: path, Child: <TextAreaEditor path={path} content={content} />
});

const parseContent = async (content: string) => {
  return { __html: await marked.parse(content, {}) };
}

export const NoteViewer = async (path: string, content: string) => BaseLayout({
  title: path, Child:
    <div class="w-full h-full p-4 prose">
      <div class="not-prose " dangerouslySetInnerHTML={await parseContent(content)}></div>
    </div>
});