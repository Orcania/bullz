import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import React from 'react';
import './style.scss';

const CustomAccordion = ({beforeIcon='', title, endIcon, children=null, expanded, addTask=undefined, removeTask=undefined, isCompleted=false}) => {
    return (
        <div className='custom-accordion-container'>
            <Accordion expanded={expanded} onChange={addTask}>
                <AccordionSummary
                    className={`${isCompleted ? 'completed' : ''}`}
                    expandIcon={endIcon}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                    IconButtonProps={{
                        onClick: removeTask
                    }}
                >
                    {beforeIcon}
                    <span>{title}</span>
                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default CustomAccordion;