/**
 * @Description Menu configuartion for module __moduleName__
 * @FileName menuConfig.js
 * @Author awesome-react-cli
 * @CreatedOn 08 February, 2021 16:39:31
 * @IssueID NA
 */
const menus = () => [{
  id: '__moduleName__',
  sequence: 1,
  icon: 'blog',
  label: '__moduleName__',
  url: '#',
  action: null,
  aclKey: '__moduleName__',
  acl: true,
  subMenu: [],
}];
const mobileMenus = menus;
export { menus, mobileMenus };
