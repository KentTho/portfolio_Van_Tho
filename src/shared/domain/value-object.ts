/** Base value object compared by structural equality. Framework-free. */
export abstract class ValueObject<TProps extends object> {
  protected constructor(protected readonly props: Readonly<TProps>) {}

  equals(other?: ValueObject<TProps> | null): boolean {
    if (!other) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
