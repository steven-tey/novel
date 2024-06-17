import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewRendererOptions } from "@tiptap/react";
import { Tweet } from "react-tweet";
export const TWITTER_REGEX_GLOBAL = /(https?:\/\/)?(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?/g;
export const TWITTER_REGEX = /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/;

export const isValidTwitterUrl = (url: string) => {
  return url.match(TWITTER_REGEX);
};

const TweetComponent = ({ node }: { node: Partial<ReactNodeViewRendererOptions> }) => {
  const url = node?.attrs?.src;
  const tweetId = url?.split("/").pop();

  if (!tweetId) {
    return null;
  }

  return (
    <NodeViewWrapper>
      <div data-twitter="">
        <Tweet id={tweetId} />
      </div>
    </NodeViewWrapper>
  );
};

export interface TwitterOptions {
  /**
   * Controls if the paste handler for tweets should be added.
   * @default true
   * @example false
   */
  addPasteHandler: boolean;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  HTMLAttributes: Record<string, any>;

  /**
   * Controls if the twitter node should be inline or not.
   * @default false
   * @example true
   */
  inline: boolean;

  /**
   * The origin of the tweet.
   * @default ''
   * @example 'https://tiptap.dev'
   */
  origin: string;
}

/**
 * The options for setting a tweet.
 */
type SetTweetOptions = { src: string };

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    twitter: {
      /**
       * Insert a tweet
       * @param options The tweet attributes
       * @example editor.commands.setTweet({ src: 'https://x.com/seanpk/status/1800145949580517852' })
       */
      setTweet: (options: SetTweetOptions) => ReturnType;
    };
  }
}

/**
 * This extension adds support for tweets.
 */
export const Twitter = Node.create<TwitterOptions>({
  name: "twitter",

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      inline: false,
      origin: "",
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(TweetComponent, { attrs: this.options.HTMLAttributes });
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-twitter]",
      },
    ];
  },

  addCommands() {
    return {
      setTweet:
        (options: SetTweetOptions) =>
        ({ commands }) => {
          if (!isValidTwitterUrl(options.src)) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addPasteRules() {
    if (!this.options.addPasteHandler) {
      return [];
    }

    return [
      nodePasteRule({
        find: TWITTER_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          return { src: match.input };
        },
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-twitter": "" }, HTMLAttributes)];
  },
});
