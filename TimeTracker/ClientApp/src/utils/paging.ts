

export function calculateTotalPages(usersCount: number, take: number): number {
    const totalPages = usersCount / take;
    return Math.ceil(totalPages);
}