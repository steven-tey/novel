import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import { Button } from "@/components/tailwind/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import hljs from "highlight.js";

export interface BubbleColorMenuItem {
    name: string;
}

const THEMES: BubbleColorMenuItem[] = [
    { name: "default" },
    { name: "github-dark" },
    { name: "github" },
    { name: "monokai" },
    { name: "docco" },
];

interface ThemeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ThemeSelector = ({ open, onOpenChange }: ThemeSelectorProps) => {
    const { editor } = useEditor();

    if (!editor) return null;

    const loadTheme = (theme: string) => {
        const existingStyle = document.getElementById('highlight-js-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('link');
        style.id = 'highlight-js-style';
        style.rel = 'stylesheet';
        style.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/${theme}.min.css`;
        document.head.appendChild(style);

        // Re-highlight all code blocks in the editor
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
            block.classList.add('hljs');
            hljs.highlightElement(block as HTMLElement); // Re-highlight the code block
        });
    };

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="sm" className="gap-2 rounded-none" variant="ghost">
                    <span>Theme</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                sideOffset={5}
                className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
                align="start"
            >
                {THEMES.map(({ name }) => (
                    <EditorBubbleItem
                        key={name}
                        onSelect={() => {
                            loadTheme(name);
                            onOpenChange(false);
                        }}
                        className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
                    >
                        <span>{name}</span>
                        {editor.isActive("theme", { name }) && <Check className="h-4 w-4" />}
                    </EditorBubbleItem>
                ))}
            </PopoverContent>
        </Popover>
    );
};
