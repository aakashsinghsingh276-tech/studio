
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Stories from 'react-insta-stories';
import { type Story } from "@/lib/data";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type StatusViewerProps = {
  story: Story;
  onClose: () => void;
};

export function StatusViewer({ story, onClose }: StatusViewerProps) {

  const storyContent = story.stories.map(s => {
      return {
          url: s.url,
          content: s.content ? (props: any) => (
              <div style={{ background: 'linear-gradient(180deg, #4B63A4 0%, #162E69 100%)', width: '100%', height: '100%', padding: 20, color: 'white' }} className="flex items-center justify-center">
                  <p className="text-3xl text-center">{s.content}</p>
              </div>
          ) : undefined,
          header: s.header,
          type: s.type,
          duration: s.duration,
      }
  })

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 bg-black max-w-full h-full md:h-[95%] md:max-w-md flex items-center justify-center">
        <DialogTitle asChild>
            <VisuallyHidden>
                <h2>Status Viewer</h2>
            </VisuallyHidden>
        </DialogTitle>
        <Stories
          stories={storyContent}
          defaultInterval={5000}
          width="100%"
          height="100%"
          onAllStoriesEnd={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
