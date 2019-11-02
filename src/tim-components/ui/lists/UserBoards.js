import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { updateCurrentBoard, saveBoard, deleteBoard } from '../../../redux-store/actions/board';
import { updateAlertDialog } from '../../../redux-store/actions/alert-dialogs'
import { loadCanvases } from '../../../redux-store/actions/canvas';
import ChangeBoardTitleDialog from '../alerts-dialogs/ChangeBoardTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
    root: {
        margin: '0 auto',
        marginTop: '2rem',
        width: '80vw',
        overflowX: 'auto',
        [theme.breakpoints.up('md')]: {
            width: "60vw"
        }
    },
    table: {
        width: "40vw",
        [theme.breakpoints.up('md')]: {
            width: "50vw"
        }
    },
}));

const useIconStyles = makeStyles({
    root: {
        color: 'red',
        '&:hover': {
            backgroundColor: "red",
            color: 'white'
        }
    }
})



const UserBoardsList = (props) => {
    const classes = useStyles();
    const iconClasses = useIconStyles();
    const { board, updateCurrentBoard, deleteBoard, loadCanvases, changeBoardTitleDialogInfo } = props;

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const handleLoadBoard = (id) => {
        const { userBoards } = board;
        const matchedBoard = userBoards.find(board => board.id === id);
        const canvases = matchedBoard.canvases;
        updateCurrentBoard(matchedBoard);
        loadCanvases(canvases)


    }

    const handleChangeTitle = (id) => {
        props.updateAlertDialog({
            alertKey: 'changeBoardTitle',
            boardId: id,
            'title': 'Enter a new title for board',
            'message': '',
            open: true,
            pending: false
        })
    }

    const handleDeleteBoard = (id) => {

        const { userBoards } = board;

        const matchedBoard = userBoards.find(board => board.id === id);

        deleteBoard(matchedBoard);


    }
    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>{`${matches ? '' : 'Load Board'}`}</TableCell>
                            <TableCell>{`${matches ? '' : 'Edit Title'}`}</TableCell>
                            <TableCell>{`${matches ? '' : 'Delete Board'}`}</TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.userBoards.map(row => {
                            return (
                                <TableRow key={row.id}>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell align={`${matches ? 'right' : 'left'}`}>
                                        <Tooltip title="Load Board">
                                            <IconButton onClick={() => handleLoadBoard(row.id)}>
                                                <AutorenewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align={`${matches ? 'right' : 'left'}`}>
                                        <Tooltip title="Change Title">
                                            <IconButton onClick={() => { handleChangeTitle(row.id) }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align={`${matches ? 'right' : 'left'}`}>

                                        <Tooltip title="Delete Board">
                                            <IconButton classes={iconClasses}
                                                onClick={() => { handleDeleteBoard(row.id) }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
            <ChangeBoardTitleDialog info={changeBoardTitleDialogInfo} />
        </>
    );
}


const mapStateToProps = (state) => {
    const { board, alertDialogs } = state;

    return {
        board,
        changeBoardTitleDialogInfo: alertDialogs.changeBoardTitle

    }
}

const mapDispatchToProps = {
    updateCurrentBoard,
    saveBoard,
    deleteBoard,
    loadCanvases,
    updateAlertDialog
}



export default connect(mapStateToProps, mapDispatchToProps)(UserBoardsList);