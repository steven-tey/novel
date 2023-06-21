import LoadingCircle from "@/ui/shared/loading-circle";
import LoadingDots from "@/ui/shared/loading-dots";
import Magic from "@/ui/shared/magic";
import { Editor, posToDOMRect, isNodeSelection, isTextSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { useCompletion } from "ai/react";

type Props = {
  editor: Editor;
};

const AIBubbleMenu: React.FC<Props> = ({ editor }: Props) => {
  const { completion } = useCompletion({
    id: "novel-edit",
    api: "/api/generate",
  });

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        placement: "bottom",
        popperOptions: {
          strategy: "absolute",
        },
        getReferenceClientRect:() =>{
          const {state, view} = editor
          const {selection} = state
          let {from, to} = selection
          if (isNodeSelection(selection)) {
            
            let node = view.nodeDOM(from) as HTMLElement

            const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector('[data-node-view-wrapper]')

            if (nodeViewWrapper) {
              node = nodeViewWrapper.firstChild as HTMLElement
            }

            if (node) {
              return node.getBoundingClientRect()
            }
          }else if (isTextSelection(selection)){
            //it's a text seleciton -get closest node
            //get resolved position
            let $pos = view.state.doc.resolve(from)
            //get parent position
            let parentPos = selection?.$anchor.pos - selection?.$anchor.parentOffset - 1;

            // todo - maybe check if the parent is a paragraph (node?.type?.name=='paragraph')
            // let parent = $pos.parent
            // if(parent?.type?.name=='paragraph')...
            
            let node = view.nodeDOM(parentPos) as HTMLElement
            
            if (node) {
              let domRect = node.getBoundingClientRect()
              let respositionRect = {}
              respositionRect.top = domRect.top
              respositionRect.height = domRect.height
              respositionRect.width = domRect.width
              respositionRect.bottom = domRect.bottom
              respositionRect.y = domRect.bottom
              //get the offset left from the main editor box
              let mainEditorBox = document.querySelector('.max-w-screen-lg')
              if(mainEditorBox){
                const editorRect = mainEditorBox.getBoundingClientRect()
                //not sure why, but about -120 puts it in the right place horizontally
                const modifyPos = -120
                respositionRect.left = editorRect.left + modifyPos
                respositionRect.x =editorRect.left + modifyPos
                return respositionRect
              }
            }

          }

          return posToDOMRect(view, from, to)
        },
        maxWidth:800
      }}
      className="mt-2 w-full overflow-hidden rounded border border-stone-200 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="p-4">
        {completion.length > 0 ? (
          completion
        ) : (
          <LoadingCircle className="h-4 w-4" />
        )}
      </div>
      <div className="flex bg-stone-100 p-2" style={{width:'600px'}}>
        <div className="flex items-left space-x-1 text-stone-500">
          <Magic className="h-5 w-5" />
          <p className="text-sm font-medium">AI is writing</p>
          <LoadingDots color="#78716C" />
        </div>
      </div>
    </BubbleMenu>
  );
};

export default AIBubbleMenu;
