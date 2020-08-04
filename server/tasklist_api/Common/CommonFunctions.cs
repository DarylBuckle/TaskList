using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace tasklist_api.Common
{
    public static class CommonFunctions
    {
        /// <summary>
        /// Converts a string to a boolean
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static bool StrToBool(string val)
        {
            bool result = false;
            try
            {
                bool.TryParse(val, out result);
            }
            catch
            {
                //ignore
            }
            return result;
        }


        /// <summary>
        /// This is used in post requests to copy properties from one object to another
        /// This excludes read only properties
        /// </summary>
        public static void CopyOldObjectAttributes(Type type, Object source, Object target, bool updatereadonly = false)
        {
            var properties = from property in type.GetProperties(BindingFlags.Instance |
                                                                        BindingFlags.DeclaredOnly |
                                                                        BindingFlags.Public)
                             select property;

            foreach (var property in properties)
            {
                var readonlykey = property.GetCustomAttribute<ReadOnlyAttribute>();
                if (updatereadonly || readonlykey == null || !readonlykey.IsReadOnly)
                {
                    property.SetValue(target, property.GetValue(source));
                }
            }
        }
    }
}
