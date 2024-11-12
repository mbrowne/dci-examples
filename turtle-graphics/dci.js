/**
 * @param {Record<string, Function | typeof forward>} roles
 * @returns {<TRole>(rolePlayer: TRole, roleName: string) => TRole}
 */
export function makeRoleBinder(roles) {
    // Conceptually it's forwarding, but in practice we just avoid adding
    // the forwarded role method in the first place since it already exists
    // on the object, which is more performant
    const rolesWithoutForwardedMethods = {}
    for (const [roleName, role] of Object.entries(roles)) {
        rolesWithoutForwardedMethods[roleName] = Object.fromEntries(
            Object.entries(role).filter(([, method]) => method !== forward)
        )
    }

    return (rolePlayer, roleName) => {
        return Object.assign(rolePlayer, rolesWithoutForwardedMethods[roleName])
    }
}

/**
 * Use this for role method names that should be conceptually "forwarded" to the
 * role-player method of the same name.
 * 
 * This is just to document that the method is part of the role interface, since
 * otherwise role-player methods should be decoupled from roles and shouldn't
 * be called directly from other roles.
 */
export const forward = Symbol('forward')