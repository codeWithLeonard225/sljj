export const DISTRICTS = [
  'Bo', 'Bonthe', 'Falaba', 'Kailahun', 'Kambia', 'Kenema', 'Kono', 'Moyamba',
  'Portloko', 'Pujehun', 'Tonkolili', 'W. Urban', 'W. Rural', 'Koinadugu', 'Bombali', 'Karena'
];

export const calculateAgeFromDob = (dobString) => {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge >= 0 ? calculatedAge.toString() : '';
};

export const calculatePassportExpiry = (issueDateString) => {
  const issueDate = new Date(issueDateString);
  if (isNaN(issueDate)) return '';
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  return expiryDate.toISOString().split("T")[0];
};