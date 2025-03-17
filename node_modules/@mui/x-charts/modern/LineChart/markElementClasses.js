import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getMarkElementUtilityClass(slot) {
  return generateUtilityClass('MuiMarkElement', slot);
}
export const markElementClasses = generateUtilityClasses('MuiMarkElement', ['root', 'highlighted', 'faded']);
export const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return composeClasses(slots, getMarkElementUtilityClass, classes);
};