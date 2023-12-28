import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tab, Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import { FOOTER_HEIGHT } from './constant';
import { useAppDispatch } from './redux/hooks';
import { hideWindowWithViewId, unminimizeWindowAndUpdateIndex } from './redux/reducers/windowsSlice';

interface MinBarProps {
    children?: any,
    index: number,
    minimized: boolean,
}

interface StyledTabProps {
  label: JSX.Element;
  onClick: React.MouseEventHandler<HTMLDivElement>,
}

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
    () => ({
        height: FOOTER_HEIGHT,
        display: "flex",
        justifyContent: "baseline"
    }),
  );


const MinBar = ({children, index, minimized } : MinBarProps) => {

    const dispatch = useAppDispatch()
      
    return (
        <AntTab onClick={() => { dispatch(unminimizeWindowAndUpdateIndex(index)) }} sx={{
            paddingInline: 0, mt: 0, padding: 0, bgcolor: !minimized ? "background.paper" : "primary.main", color: !minimized ? "background.paper.contrastText" : "primary.contrastText",
            mr: 1, ml: 1, borderTopRightRadius: "25px", borderTopLeftRadius: "25px"
        }}
            label={
                <span style={{ display: "flex", minWidth: "150px", justifyContent: "space-between", alignItems: "center" }}>
                    <IconButton component="span" onClick={e => { dispatch(hideWindowWithViewId(index)); e.stopPropagation(); }}>
                        <CloseIcon fontSize={"small"} sx={{ color: !minimized ? "background.paper.contrastText" : "primary.contrastText" }} />
                    </IconButton>
                    <Box sx={{ pr: 1, textOverflow: "ellipsis", width: "inherit" }}><p style={{ textAlign: "right", width: "150px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{children}</p></Box>
                </span>
            } />

    )

}

export default MinBar