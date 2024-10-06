import type { JSX } from 'hono/jsx';

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
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">New Note</h3>
          <button
            hx-get="/_ok"
            hx-target="#modal"
            hx-swap="delete"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close</span>
          </button>
        </div>
        <div class="px-2 pt-4 pb-1">
          <form hx-post="/new" hx-target="#modal" hx-swap="delete">
            <div class="flex flex-row items-center justify-between h-10 space-x-2">
              <input
                name="name"
                id="name"
                placeholder="Name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              ></input>
              <button
                type="submit"
                class="w-10 h-full text-white text-center bg-blue-600 hover:bg-sky-100 hover:text-sky-900 border border-slate-600 rounded overflow-hidden shadow-md"
              >
                +
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const NewButton = (props: { open: boolean }) => (
  <div
    hx-get="/_new"
    hx-target="#body"
    hx-swap="beforeend"
    class="text-white text-center py-1 px-3 bg-blue-600 hover:bg-sky-100 hover:text-sky-900 border border-slate-600 rounded shadow-md cursor-pointer"
  >
    {props.open ? 'Add Note' : '+'}
  </div>
);

const ToggleButton = (props: { open: boolean }) => (
  <div
    class="text-white text-center py-1 px-3 bg-blue-600 hover:bg-sky-100 hover:text-sky-900 border border-slate-600 rounded shadow-md cursor-pointer"
    hx-get={props.open ? '/_closedsidebar' : '/_opensidebar'}
    hx-target="#drawer-navigation"
    hx-swap="replace"
  >
    {props.open ? 'Close' : '>'}
  </div>
);

const SidebarHeader = (props: { open: boolean }) => (
  <a href='/' class="text-base font-semibold text-gray-500 dark:text-gray-400">
    {props.open ? 'MDNotes' : 'MDN'}
  </a>
);

const Sidebar = (props: { open: boolean; paths: string[] }) => (
  <div id="drawer-navigation" className={`fixed top-0 left-0 z-40 ${props.open ? 'w-64' : 'w-16'} p-4 overflow-y-auto bg-white dark:bg-gray-800 cursor-pointer flex flex-col justify-between h-full`}>
    <SidebarHeader open={props.open} />

    <div class="py-4 overflow-y-auto h-full">
      <ul class="space-y-2 font-medium">
        {props.paths.map((path) => (
          <li>
            <a href={"/" + path} class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <span class="ms-3">{path}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>

    <NewButton open={props.open} />
    <div class="h-2"></div>
    <ToggleButton open={props.open} />
  </div >
);

export const ClosedSidebar = () => (<Sidebar open={false} paths={[]} />);
export const OpenSidebar = (paths: string[]) => (<Sidebar open={true} paths={paths} />);

const BaseLayout = (props: { title: string, Child: JSX.HTMLAttributes }) => page(props.title,
  <div class="w-full h-full">
    <ClosedSidebar />
    <div class="pl-16">
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

export const Editor = (path: string, content: string) => BaseLayout({
  title: path, Child: <TextAreaEditor path={path} content={content} />
});