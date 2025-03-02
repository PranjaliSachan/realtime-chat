import { Tooltip } from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { useEffect, useRef, useState } from "react";

export enum KEYCODES {
    BOLD = 'b',
    ITALIC = 'i',
    UNDERLINE = 'u'
}

const RichTextEditor = ({ onUpdate }: any) => {
    const boldButtonRef = useRef<any>(null);
    const [bold, setBold] = useState<boolean>(false);
    const italicButtonRef = useRef<any>(null);
    const [italic, setItalic] = useState<boolean>(false);
    const underlineButtonRef = useRef<any>(null);
    const [underline, setUnderline] = useState<boolean>(false);
    const editor = useRef<any>(null);

    const handleFormatting = (e: any) => {
        if ((e.ctrlKey || e.metaKey)) {
            switch (e.key) {
                case KEYCODES.BOLD:
                    setBold(!bold);
                    break;
                case KEYCODES.ITALIC:
                    setItalic(!italic);
                    break;
                case KEYCODES.UNDERLINE:
                    setUnderline(!underline);
                    break;

                default:
                    break;
            }
        }
    }

    const handleKeyDown = (e: any) => {
        handleFormatting(e);

        if (e.key === 'Enter') {
            const content = e.target.innerHTML;
            onUpdate(content);
            e.target.innerHTML = '';
        }
    }

    useEffect(() => {
        boldButtonRef.current.style.backgroundColor = bold ? '#e4e4e7' : 'white';
        italicButtonRef.current.style.backgroundColor = italic ? '#e4e4e7' : 'white';
        underlineButtonRef.current.style.backgroundColor = underline ? '#e4e4e7' : 'white';
    }, [bold, italic, underline]);

    return (
        <>
            <div className="w-full flex flex-col justify-items-center items-start border border-zinc-200 rounded-xl">
                <div className="w-full px-4 py-2 flex flex-row justify-items-start items-center border-b border-b-zinc-200">
                    <Tooltip title="Bold">
                        <FormatBoldIcon ref={boldButtonRef} sx={{ width: 24, height: 24, borderRadius: 1, mx: 1 }} />
                    </Tooltip>
                    <Tooltip title="Italic">
                        <FormatItalicIcon ref={italicButtonRef} sx={{ width: 24, height: 24, borderRadius: 1, mx: 1 }} />
                    </Tooltip>
                    <Tooltip title="Underline">
                        <FormatUnderlinedIcon ref={underlineButtonRef} sx={{ width: 24, height: 24, borderRadius: 1, mx: 1 }} />
                    </Tooltip>
                </div>
                <div className="w-full px-4 py-2">
                    <div
                        ref={editor}
                        contentEditable="true"
                        onKeyDown={handleKeyDown}
                        className="w-full resize-none focus:outline-0"
                    />
                </div>
            </div>
        </>
    );
}

export default RichTextEditor