import React from 'react';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EditIcon from '@material-ui/icons/Edit';

type Props = {
	open: boolean;
	position: {top: number; left: number};
	handleSelect: () => void;
	handleEdit: () => void;
	closeMenu: () => void;
};

const MessageMenu: React.FC<Props> = ({open, position, handleSelect, handleEdit, closeMenu}) => {
	return (
		<Popover
			open={open}
			onClose={closeMenu}
			anchorReference='anchorPosition'
			anchorPosition={position}
			onClick={(e: React.MouseEvent) => e.stopPropagation()}
			onAnimationEnd={() => console.log('animationend')}
		>
			<MenuList onClick={(e: React.MouseEvent) => e.stopPropagation()}>
				<MenuItem
					onClick={() => {
						handleSelect();

						closeMenu();
					}}
				>
					<ListItemIcon>
						<CheckBoxIcon />
					</ListItemIcon>
					<ListItemText primary={'Select'} />
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleEdit();

						closeMenu();
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<ListItemText primary={'Edit'} />
				</MenuItem>
			</MenuList>
		</Popover>
	);
};

export default MessageMenu;
