export function parseDid(s: string) {
    const [ did, fragment ] = s.split('#');
    return { did, fragment };
}