import { useState, useEffect } from "react";
import cx from "classnames";
import { Rows, Trash2, Columns } from "lucide-react";

interface TableMenuItem {
  name: string;
  command: () => void;
  icon: typeof Rows;
}

export const TableMenu = ({ editor }: { editor: any }) => {
  const [tableLocation, setTableLocation] = useState(0);
  const items: TableMenuItem[] = [
    {
      name: "Add Column",
      command: () => editor.chain().focus().addColumnAfter().run(),
      icon: Columns,
    },
    {
      name: "Add Row",
      command: () => editor.chain().focus().addRowAfter().run(),
      icon: Rows,
    },
    {
      name: "Delete Column",
      command: () => editor.chain().focus().deleteColumn().run(),
      icon: Columns,
    },
    {
      name: "Delete Rows",
      command: () => editor.chain().focus().deleteRow().run(),
      icon: Rows,
    },
    {
      name: "Delete Table",
      command: () => editor.chain().focus().deleteTable().run(),
      icon: Trash2,
    },
  ];

  useEffect(() => {
    const handleWindowClick = () => {
      const selection: any = window.getSelection();
      const range = selection.getRangeAt(0);
      const tableNode = range.startContainer?.closest?.("table");
      if (tableNode) {
        const activeTable = tableNode.getBoundingClientRect(); // get the currently active table position
        const scrollOffset = window.scrollY; // culculating the current height of the site
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
      className="absolute left-2/4 flex translate-x-[-50%] overflow-hidden rounded border border-stone-200 bg-white shadow-xl"
      style={{
        top: `${tableLocation - 50}px`,
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.command}
          className="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
          title={item.name}
        >
          <item.icon
            className={cx("h-5 w-5 text-lg", {
              "text-red-600": item.name.includes("Delete"),
            })}
          />
        </button>
      ))}
    </section>
  );
};
