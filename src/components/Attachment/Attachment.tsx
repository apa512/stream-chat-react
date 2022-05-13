import React, { useMemo } from 'react';

import {
  AudioContainer,
  CardContainer,
  FileContainer,
  GalleryContainer,
  ImageContainer,
  isAudioAttachment,
  isFileAttachment,
  isGalleryAttachmentType,
  isImageAttachment,
  isMediaAttachment,
  MediaContainer,
} from './utils';

import type { ReactPlayerProps } from 'react-player';
import type { Attachment as StreamAttachment } from 'stream-chat';

import type { AttachmentActionsProps } from './AttachmentActions';
import type { AudioProps } from './Audio';
import type { CardProps } from './Card';
import type { FileAttachmentProps } from './FileAttachment';
import type { GalleryProps, ImageProps } from '../Gallery';
import type { ActionHandlerReturnType } from '../Message/hooks/useActionHandler';

import type { DefaultStreamChatGenerics } from '../../types/types';

export type AttachmentProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = {
  /** The message attachments to render, see [attachment structure](https://getstream.io/chat/docs/javascript/message_format/?language=javascript) **/
  attachments: StreamAttachment<StreamChatGenerics>[];
  /**	The handler function to call when an action is performed on an attachment, examples include canceling a \/giphy command or shuffling the results. */
  actionHandler?: ActionHandlerReturnType;
  /** Custom UI component for displaying attachment actions, defaults to and accepts same props as: [AttachmentActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.tsx) */
  AttachmentActions?: React.ComponentType<AttachmentActionsProps<StreamChatGenerics>>;
  /** Custom UI component for displaying an audio type attachment, defaults to and accepts same props as: [Audio](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Audio.tsx) */
  Audio?: React.ComponentType<AudioProps<StreamChatGenerics>>;
  /** Custom UI component for displaying a card type attachment, defaults to and accepts same props as: [Card](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Card.tsx) */
  Card?: React.ComponentType<CardProps>;
  /** Custom UI component for displaying a file type attachment, defaults to and accepts same props as: [File](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/FileAttachment.tsx) */
  File?: React.ComponentType<FileAttachmentProps<StreamChatGenerics>>;
  /** Custom UI component for displaying a gallery of image type attachments, defaults to and accepts same props as: [Gallery](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Gallery.tsx) */
  Gallery?: React.ComponentType<GalleryProps<StreamChatGenerics>>;
  /** Custom UI component for displaying an image type attachment, defaults to and accepts same props as: [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.tsx) */
  Image?: React.ComponentType<ImageProps>;
  /** Custom UI component for displaying a media type attachment, defaults to `ReactPlayer` from 'react-player' */
  Media?: React.ComponentType<ReactPlayerProps>;
};

/**
 * A component used for rendering message attachments. By default, the component supports: AttachmentActions, Audio, Card, File, Gallery, Image, and Video
 */
export const Attachment = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: AttachmentProps<StreamChatGenerics>,
) => {
  const { attachments, ...rest } = props;

  const gallery = useMemo(
    () => ({
      images: attachments?.filter(
        (attachment) =>
          attachment.type === 'image' && !(attachment.og_scrape_url || attachment.title_link),
      ),
      type: 'gallery',
    }),
    [attachments],
  );

  const newAttachments = useMemo(
    () =>
      gallery.images.length >= 2
        ? [
            ...attachments.filter(
              (attachment) =>
                !(
                  attachment.type === 'image' &&
                  !(attachment.og_scrape_url || attachment.title_link)
                ),
            ),
            gallery,
          ]
        : attachments,
    [gallery, attachments],
  );

  return (
    <>
      {newAttachments.map((attachment, i) => {
        const Component = getType<StreamChatGenerics>(attachment);

        // @ts-expect-error
        return <Component key={i} {...rest} attachment={attachment} />;
      })}
    </>
  );
};

const getType = <StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics>(
  attachment: AttachmentProps<StreamChatGenerics>['attachments'][number],
) => {
  if (isGalleryAttachmentType(attachment)) return GalleryContainer;

  if (isImageAttachment(attachment)) return ImageContainer;

  if (isAudioAttachment(attachment)) return AudioContainer;

  if (isFileAttachment(attachment)) return FileContainer;

  if (isMediaAttachment(attachment)) return MediaContainer;

  return CardContainer;
};
