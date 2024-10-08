import React, { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useAppContext } from '@/app/context/AppContext'
import { uploadImage, getImage, createContest } from '@/utilities/appwrite-utils';
const QuillWrapper = dynamic(
    async () => {
        const { default: ReactQuill } = await import('react-quill')
        await import('react-quill/dist/quill.snow.css')

        return function Wrapper({ forwardedRef, ...props }: QuillWrapperProps) {
            return <ReactQuill ref={forwardedRef} {...props} />
        }
    },
    { ssr: false, loading: () => <p>Loading editor...</p> }
)
import '../../app/post/rich-text-editor.css'
import { ReactQuillProps } from 'react-quill';


interface QuillWrapperProps {
    forwardedRef: React.RefObject<unknown>;
    theme: string;
    value: string;
    onChange: (value: string) => void;
    modules: unknown;
    className: string;
}

interface QuillEditorProps {
    editorFor: EditorType;
    discussion: string;
    submission: string;
    onDiscussionChange: (content: string) => void;
    onSubmissionChange: (content: string) => void;
}



function QuillEditor({ editorFor,
    discussion,
    submission,
    onDiscussionChange,
    onSubmissionChange, }: QuillEditorProps) {
    const quillRef = useRef<ReactQuillProps>(null)

    const handleRichTextChange = (content: string) => {
        if (editorFor === 'discussion') {
            onDiscussionChange(content);
        } else {
            onSubmissionChange(content);
        }
    };


    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                try {
                    // Upload the image to Appwrite storage
                    const uploadResult = await uploadImage(file)
                    console.log('Upload result:', uploadResult)

                    // Get the image URL from Appwrite storage
                    const imageUrl = await getImage(uploadResult.$id) // Assuming uploadResult contains the fileId
                    console.log('Image URL:', imageUrl)

                    // Insert the image into the Quill editor
                    const quill = quillRef.current?.getEditor()
                    if (quill) {
                        const range = quill.getSelection(true)
                        quill.insertEmbed(range.index, 'image', imageUrl, 'test')
                        quill.insertText(range.index + 1, '\n \n \n ') // Insert a newline after the image
                        setTimeout(() => {
                            quill.setSelection(quill.getSelection().index + 4, 0)
                        }, 0)
                    }

                } catch (error) {
                    console.error('Error uploading or inserting image:', error)
                }
            }
        }
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [])
    return (
        <div>
            <QuillWrapper
                forwardedRef={quillRef}
                theme="snow"
                value={editorFor === 'discussion' ? discussion : submission}
                onChange={handleRichTextChange}
                modules={modules}
                className='rich-text-editor h-40 '
            />
        </div>
    )
}

export default QuillEditor