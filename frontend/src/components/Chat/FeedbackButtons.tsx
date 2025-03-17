import ThumbDownOffAlt from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Button, IconButton, Popover, TextField } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Chat, Feedback, Message } from '../../contexts/AppContext';


type SubmitFeedbackFunction = (
  feedbackData: Feedback,
  chat: Chat,
  message: Message,
  opts: {
    onSuccess?: () => void;
    onError?: (err: any) => void;
  },
  feedbackText?: string
) => Promise<void>;

interface FeedbackButtonsProps {
  index: number;
  message: Message;
  chat: Chat;
  submitFeedback: SubmitFeedbackFunction;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ index, submitFeedback, message, chat }) => {
  const [thumbUp, setThumbUp] = useState(false);
  const [thumbDown, setThumbDown] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popoverPlacement, setPopoverPlacement] = useState<'top' | 'bottom'>('bottom');
  const [otherFeedback, setOtherFeedback] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const toggleThumbUpState = () => {
    setThumbDown(false);
    setThumbUp(prev => !prev);
  };

  const toggleThumbDownState = () => {
    setThumbUp(false);
    setThumbDown(prev => !prev);
  };

  const handleThumbUpClick = () => {
    submitFeedback(Feedback.THUMBS_UP, chat, message, {
      onSuccess: toggleThumbUpState,
      onError: (err) => {
        console.error(err);
        toggleThumbUpState();
      },
    });
  };

  const handleThumbDownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(thumbDown) {
      toggleThumbDownState();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOtherFeedback('');
  };

  const handleFeedback = (feedbackText: string) => {
    submitFeedback(
      Feedback.THUMBS_DOWN, 
      chat,
      message, 
      {
        onSuccess: () => {
            handleClose();
            toggleThumbDownState();
        },
        onError: (err) => {
            console.error(err);
            handleClose();
        },
      },
      feedbackText
    );
  };

  const open = Boolean(anchorEl);

  useLayoutEffect(() => {
    if (open && anchorEl) {
      setTimeout(() => {
        if(popoverRef.current) {
          const popoverRect = popoverRef.current.getBoundingClientRect();
          const anchorRect = anchorEl.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          if (anchorRect.bottom + popoverRect.height > viewportHeight) {
            setPopoverPlacement('top');
          } else {
            setPopoverPlacement('bottom');
          }
        }
      }, 200);
    }
  }, [open, anchorEl]);

  useEffect(() => {
    const handleResize = () => {
      if(open && anchorEl && popoverRef.current && textFieldRef.current) {
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const textFieldRect = textFieldRef.current.getBoundingClientRect();
        const anchorRect = anchorEl.getBoundingClientRect();

        const newTop = popoverPlacement === 'bottom'
          ? anchorRect.bottom + (textFieldRect.height - popoverRect.height)
          : anchorRect.top - textFieldRect.height;
        
          popoverRef.current.style.top = `${newTop}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, anchorEl, popoverPlacement]);

  return (
    <div className="flex items-center gap-0.5 relative">
      <IconButton size="small" onClick={handleThumbUpClick}>
        <ThumbUpOffAltIcon
          fontSize="small"
          className="cursor-pointer"
          sx={{ color: thumbUp ? green[500] : 'inherit' }}
        />
      </IconButton>
      <IconButton size="small" onClick={handleThumbDownClick}>
        <ThumbDownOffAlt
          fontSize="small"
          className="cursor-pointer"
          sx={{ color: thumbDown ? red[500] : 'inherit' }}
        />
      </IconButton>
      <Popover
        id={`thumbDown_${index}`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: popoverPlacement,
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: popoverPlacement === 'bottom' ? 'top' : 'bottom',
          horizontal: 'left',
        }}
      >
        <div ref={popoverRef} className="flex flex-col items-start px-3 py-4 gap-2">
          <Button 
            onClick={(e) => handleFeedback(e.currentTarget.textContent || '')}
          >
            No answer provided
          </Button>

          <Button 
            onClick={(e) => handleFeedback(e.currentTarget.textContent || '')}
          >
            Answer is made up or contains a hallucination
          </Button>

          <div ref={textFieldRef} className="w-full">
            <TextField
                className="w-full border rounded-lg border-primary-lt text-sm"
                placeholder="Other"
                multiline
                value={otherFeedback}
                onChange={(e) => setOtherFeedback(e.target.value)}
                maxRows={4}
                InputProps={{
                    style: {
                        fontSize: '0.875rem',
                        padding: '0.5rem',
                    },
                }}
            />
          </div>
          <Button 
            variant="contained" 
            onClick={() => handleFeedback(otherFeedback)}
          >
            Submit
          </Button>
        </div>
      </Popover>
      <span className="text-sm">Was it helpful?</span>
    </div>
  );
};

export default FeedbackButtons;