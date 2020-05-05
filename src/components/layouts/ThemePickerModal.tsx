import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo';
import deepPurple from '@material-ui/core/colors/deepPurple';
import {Color} from '@material-ui/core';
import {PaletteOptions} from '@material-ui/core/styles/createPalette';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(3),
	},
	group: {
		margin: `${theme.spacing}px 0`,
	},
	redRoot: {
		color: red[600],
		'&$checked': {
			color: red[500],
		},
	},
	orangeRoot: {
		color: deepOrange[600],
		'&$checked': {
			color: deepOrange[500],
		},
	},
	amberRoot: {
		color: amber[600],
		'&$checked': {
			color: amber[500],
		},
	},
	greenRoot: {
		color: green[600],
		'&$checked': {
			color: green[500],
		},
	},
	blueRoot: {
		color: blue[600],
		'&$checked': {
			color: blue[500],
		},
	},
	indigoRoot: {
		color: indigo[600],
		'&$checked': {
			color: indigo[500],
		},
	},
	deepPurpleRoot: {
		color: deepPurple[600],
		'&$checked': {
			color: deepPurple[500],
		},
	},
	checked: {},
}));

type Props = {
	open: boolean;
	closeModal: () => void;
	changeTheme: (palette: PaletteOptions) => void;
};

const ThemePickerModal: React.FC<Props> = ({open, closeModal, changeTheme}) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

	const getColorString = (value: string): string => {
		switch (value) {
			case red['500']:
				return 'red';
			case deepOrange['500']:
				return 'orange';
			case amber['500']:
				return 'amber';
			case green['500']:
				return 'green';
			case blue['500']:
				return 'blue';
			case indigo['500']:
				return 'indigo';
			case deepPurple['500']:
				return 'deepPurple';
			default:
				return 'red';
		}
	};

	const getColor = (value: string): Color => {
		switch (value) {
			case 'red':
				return red;
			case 'deepOrange':
				return deepOrange;
			case 'amber':
				return amber;
			case 'green':
				return green;
			case 'blue':
				return blue;
			case 'indigo':
				return indigo;
			case 'deepPurple':
				return deepPurple;
			default:
				return red;
		}
	};

	const getThemeType = (value: string): 'dark' | 'light' => {
		if (value === 'dark') {
			return 'dark';
		}

		return 'light';
	};

	const [typeTheme, setTypeTheme] = useState<'dark' | 'light'>(theme.palette.type);
	const [primaryColor, setPrimaryColor] = useState<string>(
		getColorString(theme.palette.primary.main),
	);

	const handleChangeTypeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = getThemeType(e.target.value);

		setTypeTheme(value);

		changeTheme({
			type: value,
			primary: getColor(primaryColor),
		});
	};

	const handleChangePrimaryColor = (e: React.ChangeEvent<{value: unknown}>): void => {
		const value = e.target.value as string;

		setPrimaryColor(value);

		changeTheme({
			type: typeTheme,
			primary: getColor(value),
		});
	};

	return (
		<Dialog open={open} onClose={closeModal} fullScreen={fullScreen}>
			<DialogTitle>Appearance</DialogTitle>

			<DialogContent>
				<FormControl component='fieldset' className={classes.formControl}>
					<FormLabel focused component='legend'>
						Theme
					</FormLabel>
					<RadioGroup value={typeTheme} className={classes.group} onChange={handleChangeTypeTheme}>
						<FormControlLabel value='light' control={<Radio color='primary' />} label='Light' />
						<FormControlLabel value='dark' control={<Radio color='primary' />} label='Dark' />
					</RadioGroup>
				</FormControl>
				<FormControl component='fieldset' className={classes.formControl}>
					<FormLabel focused component='legend'>
						Accent
					</FormLabel>
					<RadioGroup
						className={classes.group}
						value={primaryColor}
						onChange={handleChangePrimaryColor}
					>
						<FormControlLabel
							value='blue'
							control={
								<Radio
									classes={{
										root: classes.blueRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Blue'
						/>
						<FormControlLabel
							value='red'
							control={
								<Radio
									classes={{
										root: classes.redRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Red'
						/>
						<FormControlLabel
							value='deepOrange'
							control={
								<Radio
									classes={{
										root: classes.orangeRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Orange'
						/>
						<FormControlLabel
							value='amber'
							control={
								<Radio
									classes={{
										root: classes.amberRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Amber'
						/>
						<FormControlLabel
							value='green'
							control={
								<Radio
									classes={{
										root: classes.greenRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Green'
						/>
						<FormControlLabel
							value='indigo'
							control={
								<Radio
									classes={{
										root: classes.indigoRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Indigo'
						/>
						<FormControlLabel
							value='deepPurple'
							control={
								<Radio
									classes={{
										root: classes.deepPurpleRoot,
										checked: classes.checked,
									}}
								/>
							}
							label='Purple'
						/>
					</RadioGroup>
				</FormControl>
			</DialogContent>
		</Dialog>
	);
};

export default ThemePickerModal;
