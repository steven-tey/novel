import { useState, useEffect } from "react";
import { Rows, Trash2, Columns } from "lucide-react";

interface TableMenuItem {
  id: string;
  name: string;
  command: () => void;
  icon: typeof Rows;
}

export const TableMenu = ({ editor }: { editor: any }) => {
  if (!editor.isEditable) return null;

  const [tableLocation, setTableLocation] = useState(0);
  const items: TableMenuItem[] = [
    {
      id: "add-column-left",
      name: "カラムを右に追加",
      command: () => editor.chain().focus().addColumnAfter().run(),
      icon: Columns,
    },
    {
      id: "add-row-below",
      name: "行を下に追加",
      command: () => editor.chain().focus().addRowAfter().run(),
      icon: Rows,
    },
    {
      id: "delete-column",
      name: "カラムの削除",
      command: () => editor.chain().focus().deleteColumn().run(),
      icon: Columns,
    },
    {
      id: "delete-row",
      name: "行の削除",
      command: () => editor.chain().focus().deleteRow().run(),
      icon: Rows,
    },
    {
      id: "delete-table",
      name: "テーブルの削除",
      command: () => editor.chain().focus().deleteTable().run(),
      icon: Trash2,
    },
  ];
  const deleteActions = ["delete-column", "delete-row", "delete-table"];

  useEffect(() => {
    const handleWindowClick = () => {
      const selection: any = window.getSelection();
      const range = selection.getRangeAt(0);
      const tableNode = range.startContainer?.closest?.("table");
      if (tableNode) {
        const activeTable = tableNode.getBoundingClientRect(); // get the currently active table position
        const scrollOffset = window.scrollY; // calculating the current height of the site
        const tableTop = activeTable.top + scrollOffset;
        tableLocation !== tableTop && setTableLocation(tableTop);
      }
    };

    // Call the function if user click on the table
    window.addEventListener("click", handleWindowClick);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [tableLocation]);

  return (
    <section
      className="novel-absolute novel-left-2/4 novel-flex novel-translate-x-[-50%] novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-shadow-xl novel-z-40"
      style={{
        top: `${tableLocation - 50}px`,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.command}
          className="novel-p-2 novel-text-stone-600 novel-hover:bg-stone-100 novel-active:bg-stone-200"
          title={item.name}
        >
          <item.icon
            className={`novel-h-5 novel-w-5 novel-text-lg${
              deleteActions.includes(item.id) ? ' novel-text-red-600' : ''
            }`}
          />
        </button>
      ))}
    </section>
  );
};
