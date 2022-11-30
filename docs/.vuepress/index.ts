import { defaultTheme } from "@vuepress/theme-default";
import { getDirname, path } from '@vuepress/utils'
import { DefaultThemeOptions, ThemeObject } from 'vuepress';
export const commentTheme: (options: DefaultThemeOptions) => ThemeObject = options => {  
  return {
    name: "comment-theme",
    // we are extending @vuepress/theme-default
    extends: defaultTheme(options),
    clientConfigFile: path.resolve(__dirname, 'client.ts'),
    // templateDev: path.resolve(__dirname,"layout", "index.vue"),
    // templateBuild: path.resolve(__dirname,"layout", "index.vue")
    // layouts: {
    //   // we override the default layout to provide comment service
    //   Layout: path.resolve(__dirname,"layout", "index.vue"),
    // },
  }
};
