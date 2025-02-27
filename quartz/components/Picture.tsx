import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const Picture: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <a href={baseDir}>
      <img src="/images/selfie-stonecrop-cold-frame.jpg" alt="Ben Quigley" title="Ben Quigley" />
    </a>
  )
}

export default (() => Picture) satisfies QuartzComponentConstructor
