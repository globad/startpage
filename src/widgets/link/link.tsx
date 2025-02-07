import styles from './link.module.scss';
import {LinkType} from "@/modules/main-page";

export type LinkProps = {
  link: LinkType;
};

export default function Link({ link }: LinkProps) {
  return (
    <div className={styles.container}>
      <a href={link.url}>
        {link.title}
      </a>
    </div>
  );
}
