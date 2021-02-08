/**
 * @Description Export all the module specific components/objects
 * @FileName index.js
 * @Author awesome-react-cli
 * @CreatedOn 08 February, 2021 16:38:13
 * @IssueID NA
 */
export { default as __moduleName__API } from './config/apiConfig';
export {
  menus as __moduleName__Menus,
  mobileMenus as __moduleName__MobileMenus
} from './config/menuConfig';
export { default as __moduleName__Routes } from './config/routeConfig';
export * from './redux';
