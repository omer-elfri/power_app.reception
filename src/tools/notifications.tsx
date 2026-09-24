import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

export async function askPermission() {
  let permission = await isPermissionGranted();
  if (!permission) {
    permission = (await requestPermission()) === "granted";
  }
}
